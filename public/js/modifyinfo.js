"use strict";

const editButton = document.querySelector('.tail-edit-button');
const resignButton = document.querySelector('.tail-resign-button');
const helperText = document.querySelector('.profile-content-helper');
const mainButton = document.querySelector('.header-title');
const fileInput = document.getElementById('profile-image-upload');
const filePreview = document.querySelector('.profile-img');
const emailField = document.querySelector('.profile-content-email');
const nicknameInput = document.querySelector('.profile-input');
const previewContainer = document.querySelector('.profile-img-wrapper');
const nicknameHelper = document.querySelector('.profile-content-helper');
const infoModal = document.querySelector('.info-delete-modal');
const infoModalCancel = document.querySelector('.info-delete-modal-cancel');
const infoModalConfirm = document.querySelector('.info-delete-modal-confirm');
let currentUserId = null;
let originalNickname = null;


document.addEventListener('DOMContentLoaded', async function () {
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

        emailField.textContent = userData.email;
        nicknameInput.value = userData.nickname;
        originalNickname = userData.nickname; // 현재 닉네임 저장


        if (userData.image) { //to do: db연결 후 db에 이미지 저장되면 그 쪽으로 이미지 경로 수정
            // 수정된 부분: 절대 경로가 아닌 서버에서 제공된 상대 경로를 사용
            filePreview.src = `http://localhost:3001/uploads/${userData.image}`;
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                filePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('이미지 파일을 선택해주세요.');
        }
    });

    nicknameInput.addEventListener('input', function () {
        const nickname = nicknameInput.value.trim();
        if (nickname === originalNickname) {
            nicknameHelper.textContent = '*기존과 동일한 닉네임입니다.'; // to do: 동일한 닉네임이면 수정되지 않도록 변경
        } else {
            nicknameHelper.textContent = '';
        }
    });

    editButton.addEventListener('click', async function(event){
        event.preventDefault();
        const nickname = nicknameInput.value.trim();
        const email = emailField.textContent;
        const file = fileInput.files[0];
        
        if (!nickname) {
            helperText.textContent = '*닉네임을 입력해주세요.';
            return;
        }
        if (nickname.length > 10) {
            helperText.textContent = '*닉네임을 최대 10자 까지 작성이 가능합니다.';
            return;
        }

        try {
            const userResponse = await fetch(`http://localhost:3001/users`, {
                method: 'GET'
            });
            const users = await userResponse.json();
            const isNicknameTaken = users.some(user => user.nickname === nickname && user.userid !== currentUserId);
            if (isNicknameTaken) {
                helperText.textContent = '*중복된 닉네임입니다.';
                return;
            }

            let base64Image = null;
            if (file) {
                const reader = new FileReader();
                base64Image = await new Promise((resolve, reject) => {
                    reader.onload = function (e) {
                        resolve(e.target.result.split(',')[1]);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            const data = { nickname, image: base64Image };
            const response = await fetch(`http://localhost:3001/users/${currentUserId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('수정 완료');
                window.location.href = 'checkpostlist.html';
            } else {
                helperText.textContent = '수정 실패. 서버에서 문제가 발생했습니다.';
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            helperText.textContent = '수정 중 에러가 발생했습니다.';
        }
    });

    resignButton.addEventListener('click', function(){
        infoModal.style.display = 'block';
    });

    infoModalCancel.addEventListener('click', function(){
        infoModal.style.display = 'none';
    });

    infoModalConfirm.addEventListener('click', async function(){
        try {
            const response = await fetch(`http://localhost:3001/users/${currentUserId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                alert('회원 탈퇴가 완료되었습니다.');
                window.location.href = 'login.html';
            } else {
                alert('회원 탈퇴 실패. 서버에서 문제가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('회원 탈퇴 중 에러가 발생했습니다.');
        }
        infoModal.style.display = 'none';
    });



});


const menuItems = document.querySelectorAll('.menu-item');

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


/*
1. 헤더 프로필 이미지 hover시 배경식 E9E9E9
    클릭시 각 페이지로 이동

2. '수정하기'버튼 클릭시
    닉네임 입력하지 않을 시 : *닉네임을 입력해주세요
    닉네임 중복 시 : *중복된 닉네임입니다.
    니겐임 11자 이상 작성시 : *닉네임은 최대 10자 까지 작성 가능합니다.

3. '수정하기'클릭시 
    수정 성공하면 5. '수정완료'라는 토스트 메세지가 보여진다.

4. 회원 탈퇴 클릭시 
    회원 탈퇴 확인 모달이 나온다. 
    확인 클릭시 회원 탈퇴가 완료되고, 로그인페이지로 이동한다.
*/