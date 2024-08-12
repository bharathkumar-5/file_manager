const fileIcons = {
    '.txt': 'https://via.placeholder.com/200?text=TXT',       
    '.pdf': 'https://via.placeholder.com/200?text=PDF',      
    '.mp3': 'https://via.placeholder.com/200?text=MP3',      
    '.exe': 'https://via.placeholder.com/200?text=EXE',       
    '.rar': 'https://via.placeholder.com/200?text=RAR',       
    '.docx': 'https://via.placeholder.com/200?text=DOCX',    
    '.jpg': 'https://via.placeholder.com/200?text=JPG',      
    '.png': 'https://via.placeholder.com/200?text=PNG',       
    '.gif': 'https://via.placeholder.com/200?text=GIF',       
    '.zip': 'https://via.placeholder.com/200?text=ZIP',
    '.image': 'https://via.placeholder.com/200?text=IMAGE',
};
const files = JSON.parse(localStorage.getItem('files')) || [];
const bin = JSON.parse(localStorage.getItem('bin')) || [];
document.addEventListener('DOMContentLoaded',() => {
    displayFiles();
    document.getElementById('file-input').addEventListener('change',handleFileUpload);
    document.getElementById('bin-button').addEventListener('click',() => {
        // document.getElementById('file-manager').classList.add('hidden');
        // document.getElementById('bin').classList.remove('hidden');
        toggleVisibility('file-manager','bin');
        displayBin();
    });
    document.getElementById('back-button').addEventListener('click',() =>{
        toggleVisibility('bin','file-manager');
    })
    document.getElementById('clear-bin').addEventListener('click',clearBin);
});
function displayFiles(){
    const container = document.getElementById('files-container');
    container.innerHTML = '';
    files.forEach(file => {
        const [name, ext] = file.split('.');
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <img src="${fileIcons[ext] || fileIcons['image']}" alt="${ext} icon">
            <div>${name}</div>
            <button onclick="moveToBin('${file}')">Move to Bin</button>
            <button onclick="editFileName('${file}')">Edit Name</button>
        `;
        container.appendChild(item);
    });
}
function handleFileUpload(event){
    const newFiles = Array.from(event.target.files).map(file => file.name);
    files.push(...newFiles);
    localStorage.setItem('files',JSON.stringify(files));
    displayFiles();
}
function moveToBin(file){
    const index = files.indexOf(file);
    if (index !== -1){
        files.splice(index,1);
        bin.push(file);
        localStorage.setItem('files',JSON.stringify(files));
        localStorage.setItem('bin',JSON.stringify(bin));
        displayFiles();
        displayBin();
        autoDeleteFile(file);
    }
}
function autoDeleteFile(file){
    setTimeout(() => {
        const index = bin.indexof(file);
        if (index !== -1){
            bin.splice(index,1);
            localStorage.setItem('bin',JSON.stringify(bin));
            displayBin();
        }
    },30000);
}
function displayBin(){
    const container = document.getElementById('bin-files-container');
    container.innerHTML = '';
    bin.forEach(file => {
        const [name,ext] = file.split('.');
        const item = document.createElement('div');
        item.className = 'bin-item';
        item.innerHTML = `
           <img src="${fileIcons[ext] || fileIcons['image']}" alt="${ext} icon">
           <div>${name}</div>
           <button onclick="restoreFile('${file}')">Restore</button>
           <button onclick="deleteFileFromBin('${file}')">Delete</button>
        `;
        container.appendChild(item);
    });
}
function restoreFile(file){
    const index = bin.indexof(file);
    if(index !== -1){
        bin.splice(index,1);
        files.push(file);
        localStorage.setItem('files',JSON.stringify(files));
        localStorage.setItem('bin',JSON.stringify(bin));
        displayFiles();
        displayBin();
    }
}
function deleteFileFromBin(file){
    showConfirmModal(`Are you sure you want to permanently delete "${file}"?`).then(()=>{
        const index = bin.indexof(file);
        if (index !== -1){
            bin.splice(index,1);
            localStorage.setItem('bin',JSON.stringify(bin));
            displayBin();
        }
    }).catch(() => {});
}
function clearBin(){
    showConfirmModal(`Are you sure you want to clear the bin?`).then(()=>{
        bin.length = 0;
        localStorage.removeItem('bin')
        displayBin();
    }).catch(() => {});
}
function editFileName(file){
    const [name,ext] = file.split('.');
    document.getElementById('edit-file-name').value = name;
    document.getElementById('edit-modal').classList.remove('hidden');
    document.getElementById('confirm-edit').onclick = () => {
        const newName = document.getElementById('edit-file-name').value;
        if (newName){
            const index = files.indexOf(file);
            if (index !== -1){
                files[index] = `${newName}.${ext}`;
                localStorage.setItem('files',JSON.stringify(files));
                displayFiles();
                document.getElementById('edit-modal').classList.add('hidden');
            }
        }
    }
    document.getElementById('close-edit-modal').onclick = () => {
        document.getElementById('edit-modal').classList.add('hidden');
    };
}

function showConfirmModal(message){
    return new Promise((resolve,reject) => {
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-modal').classList.remove('hidden');
        document.getElementById('confirm-yes').onclick = () => {
            document.getElementById('confirm-modal').classList.add('hidden');
            resolve();
        };
        document.getElementById('confirm-no').onclick = () => {
            document.getElementById('confirm-modal').classList.add('hidden');
            reject();
        };
        document.getElementById('close-confirm-modal').onclick = () => {
            document.getElementById('confirm-modal').classList.add('hidden');
            reject();
        };
    });
}
function toggleVisibility(showId,hideId){
    document.getElementById(showId).classList.remove('hidden');
    document.getElementById(hideId).classList.add('hidden');
}