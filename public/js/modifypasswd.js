"use strict";

/* 
1. 비밀번호 input에 입력하지 않거나 유효성 검사를 통과하지 못할 경우.
    유효성 검사 -> *비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야한다.

비밀번호 input
    비밀번호 입력 안했을 시 : *비밀번호를 입력해주세요.
    비밀번호가 확인과 다를 시 : *비밀번호 확인과 다릅니다. 

비밀번호 확인 input
    비밀번호 확인 입력 안했을 시 : *비밀번호를 한번 더 입력해주세요.
    비밀번호 확인이 비밀번호 다를 시 : * 비밀번호와 다릅니다.

2. 모든 정보를 입력하고 유효성검사를 통과했을 시 수정하기 버튼 활성화 (ACA0EB -> 7F6AEE)
    수정하기 클릭시 
    수정 성공하면 '수정 성공'이라는 토스트메세지 표시
*/

    const passwordInput = document.querySelector('.body-passwd-input');
    const passwordCheckInput = document.querySelector('.body-passwdck-input');
    const editButton = document.querySelector('.edit-button');
    const passwordHelper = document.querySelector('.body-passwd-helper');
    const passwordCheckHelper = document.querySelector('.body-passwdck-helper');
    const mainButton = document.querySelector('.header-title');
    let currentUserId = null;


    mainButton.addEventListener('click', function(){
        window.location.href = 'checkpostlist.html';
    });

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }

    //비밀번호 유효성 검사 및 버튼 색상, 그저 함수
    function checkAllValidations() {
        const isPasswordValid = validatePassword(passwordInput.value);
        const isPasswordMatching = passwordInput.value === passwordCheckInput.value;

        if (isPasswordValid && isPasswordMatching ) {
            editButton.style.backgroundColor = '#7F6AEE';
            editButton.disabled = false;
            // Assuming this should be the action on click
        } else {
            editButton.style.backgroundColor = '#ACA0EB';
            editButton.disabled = true; // Prevent navigation
        }

    }

    //헤더 프로필 이미지 호버 배경 변경
    //=======================================================================================
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(function(menuItem) {
        menuItem.addEventListener('mouseover', function() {
            menuItem.style.backgroundColor = '#E9E9E9';
        });

        menuItem.addEventListener('mouseout', function() {
            menuItem.style.backgroundColor = '#d9d9d9';
        });
    });
     // 첫 번째 menu-item (회원정보수정)에 클릭 이벤트 추가


    document.addEventListener('DOMContentLoaded',async function() {

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
        } catch (error) {
            console.error('Error fetching session data:', error);
        }

    });
    //=======================================================================================

    editButton.addEventListener('click', async function(event){
        event.preventDefault();
        if(!editButton.disabled){
            try {
                const password = passwordInput.value.trim();
                const data = { password };
                const response = await fetch(`http://localhost:3001/users/${currentUserId}/password`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                if (response.ok) {
                    alert('수정 성공');
                    window.location.href = 'checkpostlist.html';
                } else {
                    passwordHelper.textContent = '수정 실패. 서버에서 문제가 발생했습니다.';
                }
            } catch (error) {
                console.error('Error updating password:', error);
                passwordHelper.textContent = '수정 중 에러가 발생했습니다.';
            }
        }
    });

    //비밀번호 유효성 검사
    //=======================================================================================
    passwordInput.addEventListener('focusout', function() {
        if (passwordInput.value === '') {
            passwordHelper.innerText = '*비밀번호를 입력해주세요.';
        } else if (!validatePassword(passwordInput.value)) {
            passwordHelper.innerText = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        } 
        else if (passwordCheckInput.value !== passwordInput.value ){
            passwordHelper.innerText = '*비밀번호 확인과 다릅니다.'
        }
        else {
            passwordHelper.innerText = '';
        }
        checkAllValidations();
    });

    passwordCheckInput.addEventListener('focusout', function() {
        if (passwordCheckInput.value !== passwordInput.value) {
            passwordCheckHelper.innerText = '*비밀번호와 다릅니다.';
        } 
        else if (passwordCheckInput.value === ''){
            passwordCheckHelper.innerText = '*비밀번호를 한번 더 입력해주세요.';
        }

        else {
            passwordCheckHelper.innerText = '';
        }
        checkAllValidations();
    });
    //입력값 수정시에마다 확인
    passwordInput.addEventListener('input', checkAllValidations);
    passwordCheckInput.addEventListener('input', checkAllValidations);

//=======================================================================================

//비밀번호 수정 fetch 유효성 검사 통과 시 해당 userId 값을 받아서 그 id 값에 일치하는 비밀번호를 변경


