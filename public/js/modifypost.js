"use strict";
const titleInput = document.querySelector('.content-header-subtitle-input');
const fileUpload = document.getElementById('file-upload');
const completeButton = document.querySelector('.complete-button');
const contentBody = document.getElementById('body-input');
const previewContainer = document.querySelector('.file-upload-text');

//헤더 프로필 이미지 호버 배경 변경
const menuItems = document.querySelectorAll('.menu-item');
const mainButton = document.querySelector('.header-title');

mainButton.addEventListener('click', function(){
        window.location.href = 'checkpostlist.html';
    });

menuItems.forEach(function(menuItem) {
    menuItem.addEventListener('mouseover', function() {
        menuItem.style.backgroundColor = '#E9E9E9';
    });

    menuItem.addEventListener('mouseout', function() {
        menuItem.style.backgroundColor = '#d9d9d9';
    });
});

// 프로필 이미지 클릭 이벤트 추가
document.addEventListener('DOMContentLoaded', function() {
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
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    fetch(`http://localhost:3001/posts`)
        .then(response => response.json())
        .then(data => {
            const post = data.find(post => post.id == postId);
            if (post) {
                titleInput.value = post.title;
                contentBody.value = post.content;
                if (post.image) {
                    const img = document.createElement('img');
                    img.src = `http://localhost:3001${post.image}`;
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    previewContainer.textContent = '';
                    previewContainer.appendChild(img);
                } else {
                    previewContainer.textContent = '기존 파일 명';
                }
            }
        });

    fileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                previewContainer.innerHTML = '';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            alert('이미지 파일을 선택해주세요.');
            this.value = '';
        }
    });
});
// 예를 들어, 수정 폼의 제출 버튼에 대한 이벤트 리스너를 추가합니다.
completeButton.addEventListener('click', async function(e) {
    e.preventDefault(); // 폼 기본 제출 방지
    
    const postId = new URLSearchParams(window.location.search).get('postId');
    const title = titleInput.value.trim();
    const content = contentBody.value.trim();
    const file = fileUpload.files[0];
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
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            content: content,
            image: base64Image // 수정된 이미지 데이터 추가
        })
    });

    if (response.ok) { 
        alert('수정 되었습니다.');
        window.location.href = `detailpost.html?postId=${postId}`; // 수정이 완료된 후, 상세 페이지로 리디렉션
    } else {
        alert('수정 실패. 서버에 문제가 발생했습니다.');
    }
    } catch (error) {
        console.error('Error:', error);
        alert('수정 중 에러가 발생했습니다.');
    }
});