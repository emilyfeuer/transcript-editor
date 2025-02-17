// Grab each element by id in order to change the id name.
    
    let transcript_container = document.querySelector(".transcript-container");  
    let transcript = document.getElementById("transcript");
    let edit_button = document.getElementById("edit-transcript");
    let save_button = document.getElementById("save-transcript");
    let delete_button = document.getElementById("delete-transcript");
    let timestamps = {"timestamps": []};

// This function is called when the user clicks the edit button

function editTranscript(){
    console.log("************ Editing Transcript ***************");
 
    // Hides all unessiary buttons and displays the save and delete buttons

    transcript_container.classList.replace('transcript-container','transcript-container-editing');
    transcript.setAttribute('id', 'transcript-editing');
    edit_button.style.display = "none";
    save_button.style.display = "inline";
    delete_button.style.display = "inline";

    

}

async function saveTranscript(){
    console.log("saving transcript");

    transcript_container.classList.replace('transcript-container-editing','transcript-container');
    transcript.setAttribute('id', 'transcript');
    edit_button.style.display = "inline";
    save_button.style.display = "none";
    delete_button.style.display = "none";
    
    if (timestamps["timestamps"].length > 0){
        cutVideo(id, timestamps);    
    }
}

const transcript_del = document.getElementById("transcript");

transcript_del.addEventListener("mousedown", function(event) {
    if (event.target.tagName === "SPAN" && event.target.hasAttribute("data-start")) {

        // Set a flag on the document object to indicate that text is being selected
        document.isTextSelected = true;

        // Toggle the 'selected-word' class on the clicked element
        event.target.classList.toggle("selected-word");

        // Check if all words in the paragraph are selected
        const allWordsSelected = Array.from(event.target.parentNode.querySelectorAll("span[data-start]"))
            .every(span => span.classList.contains("selected-word"));

        // Toggle the 'selected-paragraph' class on the paragraph element if all words are selected
        event.target.parentNode.classList.toggle("selected-paragraph", allWordsSelected);
    }
});

document.addEventListener("mousemove", function(event) {
    if (document.isTextSelected && event.target.tagName === "SPAN" && event.target.hasAttribute("data-start")) {

        // Toggle the 'selected-word' class on the hovered element
        event.target.classList.toggle("selected-word", true);

        // Check if all words in the paragraph are selected
        const allWordsSelected = Array.from(event.target.parentNode.querySelectorAll("span[data-start]"))
            .every(span => span.classList.contains("selected-word"));

        // Toggle the 'selected-paragraph' class on the paragraph element if all words are selected
        event.target.parentNode.classList.toggle("selected-paragraph", allWordsSelected);
    }
});

document.addEventListener("mouseup", function() {
    // Reset the flag on the document object
    document.isTextSelected = false;
});

function deleteTranscript() {

    // Get all the selected words
    let selectedWords = document.querySelectorAll('.selected-word');
    let selectedWordsArr = Array.from(selectedWords);
    
    
    if (selectedWordsArr.length > 0){
    // if any word has been selected, then update the video
        selectedWordsArr.forEach(element => {
            console.log(element);
            timestamps["timestamps"].push([parseFloat(element.getAttribute("data-start")), parseFloat(element.getAttribute("data-stop"))]);
            element.remove();
        });

        

        console.log("----timestamps-----");
        console.log(timestamps);
        
    }
    //selectedWordsArr.forEach(span => span.remove());

    // Update the transcript HTML with the modified HTMLi
    document.addEventListener('DOMContentLoaded', () => {
        
        let transcriptContainer = document.querySelector('.transcript-container');
        let transcriptHTML = transcriptContainer.innerHTML;

        transcriptArea.innerHTML = transcriptHTML;
    });
}

async function downloadTranscript(){  
    console.log("downloading video"); 

    var data = new FormData();
    data.append('id', id);

    var videoUrl = await makeRequest("/api/get/", data); 
    var filename = "video.mp4";

    console.log("Download URL:")
    console.log(videoUrl);
    console.log(videoUrl["url"]);
    
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function() {
        saveAs(xhr.response, filename);
    };
    xhr.open("GET", videoUrl["url"]);
    xhr.send();
}


