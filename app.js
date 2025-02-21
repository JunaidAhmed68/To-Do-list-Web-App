// -----------------------If UID doesn't exist, redirect to the login page-------------------------
const uid = localStorage.getItem('todo-uid');
if (uid) {
  document.querySelector('#login-btn').style.display = 'none'; // Hide the logout button
  document.querySelector('.profile-logout-div').style.display = 'block'; // Hide the logout button

}else {
  document.querySelector('#login-btn').style.display = 'block'; // Hide the logout button
  document.querySelector('.profile-logout-div').style.display = 'none'; // Hide the logout button
}
function redirectCheck() {
  if (!uid) {
    window.location.href='./Form/form.html'; 
    return // Redirect to the login page
  } 
}
// if (!uid) {
//   window.location.replace('./Form/form.html');  // Redirect to the login page
// }


// ------------------------------- import msg fun and firebase functions -----------------
import { auth, signOut ,query,deleteDoc ,getDocs , getDoc, doc , db, addDoc ,where, collection ,serverTimestamp,updateDoc,orderBy, showMessage} from "./firebaseConfig.js";


// ----------------------------------- logout ---------------------------------------------
document.querySelector(".logout-btn").addEventListener("click", async () => {
  try {
    redirectCheck();
    await signOut(auth);
    localStorage.removeItem("todo-uid");
    window.location.replace('./Form/form.html');
  } catch (error) {
    alert(error.message);
  }
});


// ----------------------------Get modal and elements---------------------------------------
const modal = document.getElementById('myModal');
const cancelBtn = document.getElementById('cancelBtn');
const savePostBtn = document.getElementById('savePostBtn');
const postTextInput = document.getElementById('editPostText');
const bodyContent = document.querySelector('.main-content'); // Or select any content you want to blur
const  taskList = document.getElementById("taskList");
let addTaskBtn = document.getElementById("addTask");


// ------------------------------------- add task --------------------------------------------
document.querySelector("#addTask").addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent the default form submission
  redirectCheck();
  // document.querySelector("#myModal").style.display = "block";
  const taskInput = document.getElementById("taskInput");
  let taskText = taskInput.value.trim();
  // Check if at least one of the fields is filled
  if (!taskText) {
      showMessage("Please provide task text to add!")
      return;
  }

  try {
      taskInput.value = "";
      // Add the task data to Firestore
      await addDoc(collection(db, "tasks"),{
        text: taskText,
        uid: uid,
        createdAt:serverTimestamp(),
        done: false,
      });   
      showMessage("Task added successfully!")
      getMyTasks()
  } catch (error) {
      console.error("Error creating post: ", error);
      showMessage("Error creating post.")
  }
});


// ------------------------------- update task code ---------------------------------------------
let currentPostId = ''; // Variable to store the post ID for editing
// Function to update the post
const updatePost = async (postId, currentText) => {
  redirectCheck();
  // Store the post ID to use later
  currentPostId = postId;

  // Open the modal and populate the text area with the current post text
  postTextInput.value = currentText || ''; // Fill textarea with current text
  modal.style.display = 'flex'; // Show modal  
  addTaskBtn.style.display = "none"; // Blur when opening

  // Close modal when cancel button is clicked
  cancelBtn.onclick = () => {
    modal.style.display = 'none'; // Hide modal
    bodyContent.style.filter = 'none'; // Remove blur from background content
    addTaskBtn.style.display = "flex"; // Refocus on Add button after closing
  };

  // Save updated text when Save button is clicked
  savePostBtn.onclick = async () => {
    const newPostText = postTextInput.value.trim();

    if (newPostText === "") {
      showMessage("Post text cannot be empty.");
      return; // Stop if user doesn't provide new text
    }

    try {
      // Update the post in Firestore
      const postRef = doc(db, "tasks", postId);
      await updateDoc(postRef, {
        text: newPostText, // New post text
        createdAt: serverTimestamp() // Optionally track when the post was updated
      });

      // Close modal and remove blur from background
      modal.style.display = 'none';
      bodyContent.style.filter = 'none';
      addTaskBtn.style.display = "flex"; // Refocus on Add button after closing

      await getMyTasks(); // Reload the tasks after update
      showMessage("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      showMessage("There was an error updating the post.");
    }
  };
};


// ------------------------ delete task code  or delete all tasks----------------------------
// Function to delete a post
const deletePost = async (event, postId) => {
  try {
     redirectCheck();
      // Ensure event.target is defined before calling closest
      if (event.target) {
          const listItem = event.target.closest("li");
          if (listItem) {
              listItem.remove(); // Remove the post from the UI
          }
      }
      const postRef = doc(db, "tasks", postId);
      await deleteDoc(postRef);  // Delete the post from Firestore

      getMyTasks()
      showMessage("Post deleted successfully!");

  } catch (error) {
      console.error("Error deleting post:", error);
      showMessage("There was an error deleting the post.");
  }
};
// Function to delete all tasks
async function deleteAllTasks() {
    try {
        redirectCheck();
        const q = query(collection(db, "tasks"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showMessage("No tasks found to delete.");
            return;
        }

        // Sequential deletion using for...of
        for (const doc of querySnapshot.docs) {
            await deleteDoc(doc.ref);
        }

        showMessage("All tasks deleted successfully!");
        getMyTasks(); // Refresh the task list
    } catch (error) {
        console.error("Error deleting tasks:", error);
        showMessage("There was an error deleting tasks.");
    }
}

// ------------------------------- mark as done code ---------------------------------------------
// Function to mark a task as done
const markAsDone = async (e, taskId, currentStatus) => {
  try {
    redirectCheck();
    const taskRef = doc(db, "tasks", taskId);
    const newStatus = !currentStatus; // Toggle the done status

    await updateDoc(taskRef, {
      done: newStatus // Update the done status in Firestore
    });

    // Change the UI based on the new status
    await getMyTasks(); // Refresh the task list to ensure the UI is in sync
    showMessage("Task status updated successfully!");
    
  } catch (error) {
    console.error("Error updating task status:", error);
    showMessage("There was an error updating the task status.");
  }
};




// --------------------------- modals code open close etc ----------------------------------
  let currentTaskId = "";
  let deleteAllFlag = false; // Use a boolean flag instead of storing taskId
  
  // Function to open the delete confirmation modal
  const openDeleteModal = (eventD, taskId) => {
      addTaskBtn.style.display = "none"; // Hide the add task button
      currentTaskId = taskId; // Store the task ID for single task deletion
  
      // Check if the event is for deleting all tasks
      if (eventD === "deleteAll") {
          deleteAllFlag = true; // Set the flag for deleting all tasks
          document.getElementById("deleteCnfmText").innerText = "Are you sure you want to delete all tasks?";
      } else {
        deleteAllFlag = false; // Reset the flag for single task deletion
        document.getElementById("deleteCnfmText").innerText = "Are you sure you want to delete this task?";
      }
  
      document.getElementById("deleteModal").style.display = "block"; // Show the modal
  };
  
  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
      document.getElementById("deleteModal").style.display = "none"; // Hide the modal
      document.getElementById("profileModal").style.display = "none"; // Hide the modal
      addTaskBtn.style.display = "flex"; // Refocus on Add button after closing
    };
    

    //---------------------------------- Function to fetch user data ------------------------------
    async function fetchUserData(uid) {
        try {
          const userRef = doc(db, "users", uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.empty) {
                return userDoc.data();
            } else {
                console.error("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    }


    // ----------------------------get all tasks of user or render -------------------------
    // Function to get all tasks of the current user
    let getMyTasks = async () => {
      try {
        const q = query(
          collection(db, "tasks"),
          where("uid", "==", uid),
          orderBy("createdAt", "desc") // Order by createdAt in descending order
         );
        const querySnapshot = await getDocs(q);
        
        let deleteAllTasksBTN= document.querySelector("#deleteAllTasksBtn")
          
         deleteAllTasksBTN.style.display = "block";
        if (querySnapshot.empty) {
          taskList.innerHTML = "<p class='text-center'>Add your first task.</p>";
          deleteAllTasksBTN.style.display = "none";
          return;
        }
    
        // Clear previous posts
        taskList.innerHTML = "";
    
    
        querySnapshot.forEach((task) => {
          const taskData = task.data();
          console.log(task.id, taskData);
    
          // Convert Firestore Timestamp to JS Date
          let createdAt = "Unknown date";
          if (taskData.createdAt?.toDate) {
            createdAt = taskData.createdAt.toDate().toLocaleString(); // Include date and time
          }
    
          let updatedAt = "Unknown date";
          if (taskData.updatedAt?.toDate) {
            updatedAt = taskData.updatedAt.toDate().toLocaleString(); // Include date and time
          }
    
          let li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center cen-div";
          const taskText = taskData.text.slice(0, 20) + "..."; 
          
          li.innerHTML = `
            <div class="d-flex flex-column">
              <span class="task-text">${taskText}</span>
              <small class="task-date">
                ${updatedAt !== "Unknown date" ? `${updatedAt}` : `${createdAt}`}
              </small>
            </div>
          
            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm check">✔</button>
              <button class="btn btn-danger btn-sm delete">Delete</button>
            </div>
          `;
    
          const checkBtn = li.querySelector(".check");
          // Select the task text element after setting innerHTML
          const taskTextElement = li.querySelector(".task-text");
    
          // Toggle the completed class based on the new status
          if (taskData.done) {
            taskTextElement.classList.add("completed"); // Add class if done
          } else {
            taskTextElement.classList.remove("completed"); // Remove class if not done
            checkBtn.style.backgroundColor = "white";
          }
    
          checkBtn.addEventListener("click", async (event) => {
            event.stopPropagation(); // Prevent modal from opening
            await markAsDone(event, task.id, taskData.done); // Call the function to mark as done
          });
    
          const deleteBtn = li.querySelector(".delete");
          deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent modal from opening
            openDeleteModal(event,task.id); // Open the delete confirmation modal
          });
    
          li.addEventListener("click", (event) => updatePost(task.id, taskData.text)); // Call the function to update the post
          taskList.append(li);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

// -------------------------------- IIFE to get tasks and user data --------------------------------
    ( async () => { 
      getMyTasks();
      const profPic = document.getElementById("profile-pic");
      fetchUserData(uid).then((userData) => {
          profPic.src = userData.photoURL || 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg';
        })
    })();



    
    

    
// ------------------------------- Event listeners ---------------------------------------------
     // Event listener for the delete all tasks button
     document.querySelector("#deleteAllTasksBtn").addEventListener("click", () => {
      openDeleteModal("deleteAll"); // Open the modal for deleting all tasks
      });
     document.querySelector("#login-btn").addEventListener("click", () => {
      redirectCheck();
      });
    
      // Event listener for the delete button
      document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
          if (deleteAllFlag) {
              await deleteAllTasks(); // Call the function to delete all tasks
          } else {
              await deletePost(event, currentTaskId); // Call the delete function with the current task ID
          }
          closeDeleteModal(); // Close the modal after deletion
        });

      document.querySelector("#closeDeleteModal").addEventListener("click", () => {
        closeDeleteModal();
      });
      document.querySelector("#cancelDeleteBtn").addEventListener("click", () => {
        closeDeleteModal();
      });
        
        
        // Event listener for profile picture click
        document.querySelector('#profile-pic').addEventListener('click', async () => {
          redirectCheck();

            const userData = await fetchUserData(uid);
        
            if (userData) {
                // Populate modal with user data
                document.getElementById('modal-profile-pic').src = userData.photoURL || 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'; // Assuming you have a profile picture URL
                document.getElementById('user-name').innerText = userData.displayName || 'N/A';
                document.getElementById('user-email').innerText = userData.email || 'N/A';
                document.getElementById('account-created').innerText = userData.createdAt.toDate().toLocaleString() || 'N/A';
        
                // Show the modal
                const profileModal = document.getElementById('profileModal');
                profileModal.style.display = 'block';
                addTaskBtn.style.display = "none"; // Refocus on Add button after closing
        
            }
        });


        document.getElementById('closeProfileModal').addEventListener('click', () => {
          closeDeleteModal();
        })
        
        // Logout button functionality (optional)
        document.getElementById('logout-btn').addEventListener('click', async () => {
          try {
            await signOut(auth);
            localStorage.removeItem("uid");
            window.location.replace('../index.html');
          } catch (error) {
            alert(error.message);
          }
        });

// ------------------- theme change code---------------------------------------------
       document.addEventListener("DOMContentLoaded", function () {
          const themeToggleBtn = document.getElementById("theme-toggle");
        
          // Function to update button text
          function updateButtonText() {
            themeToggleBtn.innerText = document.documentElement.classList.contains("dark-theme")
              ? "Light Mode"
              : "Dark Mode";
          }
        
          // Check local storage for theme preference
          if (localStorage.getItem("dark-theme") === "enabled") {
            document.documentElement.classList.add("dark-theme");
        
            // Apply text color to all elements with class 'list-group'
            document.querySelectorAll(".list-group").forEach(el => {
              el.style.color = "white";
            });
        
            // Update button text
            updateButtonText();
          }
        
          // Toggle theme on button click
          themeToggleBtn.addEventListener("click", function () {
            document.documentElement.classList.toggle("dark-theme");
        
            // Apply text color dynamically when toggling
            document.querySelectorAll(".list-group").forEach(el => {
              el.style.color = document.documentElement.classList.contains("dark-theme") ? "white" : "";
            });
        
            // Save preference to local storage
            if (document.documentElement.classList.contains("dark-theme")) {
              localStorage.setItem("dark-theme", "enabled");
            } else {
              localStorage.removeItem("dark-theme");
            }
        
            // Update button text
            updateButtonText();
          });
        });
        
