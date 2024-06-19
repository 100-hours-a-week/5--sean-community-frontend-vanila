"use strict";

const contentHeader = document.querySelector('.content-header-subtitle-input');
const createButton = document.querySelector('.complete-button')
const contentBody = document.getElementById('body-input')
const helperText = document.getElementsByClassName('content-tail-helper')
const conTainer = document.getElementsByClassName('container')
const fileInput = document.getElementById('file-upload');
const previewContainer = document.querySelector('.image-preview-wrapper');
const menuItems = document.querySelectorAll('.menu-item');
const mainButton = document.querySelector('.header-title');
let currentUserId = null;
let currentNickname = null;
let currentUserImage = null;

mainButton.addEventListener('click', function(){
    window.location.href = 'checkpostlist.html'; // to do: frontent에서 라우터 설정
});


//================================================================================
menuItems.forEach(function(menuItem) {
    menuItem.addEventListener('mouseover', function() {
        menuItem.style.backgroundColor = '#E9E9E9';
    });

    menuItem.addEventListener('mouseout', function() {
        menuItem.style.backgroundColor = '#d9d9d9';
    });
});

// 프로필 이미지 클릭 이벤트 추가
document.addEventListener('DOMContentLoaded',async function() {
    var menuItems = document.querySelectorAll('.menu-item');

    // 첫 번째 menu-item (회원정보수정)에 클릭 이벤트 추가
    menuItems[0].addEventListener('click', function() {
        // 오타로 인한 문제를 JS로 해결
        window.location.href = 'modifyinfo.html'; // 오타가 있는 herf 속성 사용
    });

    // 두 번째 menu-item (비밀번호수정)에 클릭 이벤트 추가
    menuItems[1].addEventListener('click', function() {
        window.location.href = 'modifypasswd.html'; // 비밀번호 변경 페이지로 이동
    });

    // 세 번째 menu-item (로그아웃)에 클릭 이벤트 추가
    menuItems[2].addEventListener('click', function() {
        window.location.href = 'login.html'; // 로그아웃 처리 페이지로 이동
    });

    try {
        const sessionResponse = await fetch('http://localhost:3001/users/session', {
            credentials: 'include'
        });
        const sessionData = await sessionResponse.json();
        currentUserId = sessionData.result;

        const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`, {
            credentials: 'include'
        });
        const userData = await userResponse.json();
        currentNickname = userData.nickname;
        currentUserImage = userData.image;

    } catch (error) {
        console.error('Error fetching session data:', error);
    }
});
//================================================================================

function updateButtonColor(){
    if (contentHeader.value.trim() && contentBody.value.trim()){
        createButton.style.backgroundColor = '#7F6AEE'; // 모두 채워졌을 때 색상
    } else {
        createButton.style.backgroundColor = '#ACA0EB'; // 하나라도 비어있을 때 색상
    }
}
contentHeader.addEventListener('input', updateButtonColor);
contentBody.addEventListener('input', updateButtonColor);

createButton.addEventListener('click', function(event){
    event.preventDefault();

    const header = contentHeader.value.trim(); 
    const body = contentBody.value.trim();

    if ( !header || !body ){
        helperText[0].textContent = '*제목과 내용을 모두 작성해주세요.'; // 텍스트 변경
    } else {
        
    }
});


document.addEventListener('DOMContentLoaded', function () {
    

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        
        // 이 부분에서 선택된 파일이 이미지인지 확인
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function (e) {
                // 이미지 미리보기를 표시하기 위한 img 요소를 생성
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%'; // 이미지 크기 조정
                img.style.height = 'auto';
                
                // 이전에 추가된 이미지를 제거
                previewContainer.innerHTML = '';
                // 새로운 이미지를 추가
                previewContainer.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('이미지 파일을 선택해주세요.');
            
        }
    });
});

const createPostButton = document.querySelector('.complete-button');

createPostButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const header = contentHeader.value.trim();
    const body = contentBody.value.trim();
    const file = fileInput.files[0];

    if (!header || !body) {
        helperText[0].textContent = '*제목과 내용을 모두 작성해주세요.';
    } else {
        let base64Image = null;
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            base64Image = await new Promise((resolve, reject) => {
                reader.onload = function(e) {
                    resolve(e.target.result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
        try {
            const response = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: header,
                    content: body,
                    image: base64Image,
                    userId: currentUserId,
                    nickname: currentNickname,
                    profileImage: currentUserImage
                })
            });
            if (response.ok) {
                alert('게시글이 작성되었습니다.');
                window.location.href = "checkpostlist.html";
            }
        } catch (error) {
            console.error('Error', error);
            alert('생성 중 에러 발생');
        }
    }
});