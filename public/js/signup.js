"use strict";
    const emailInput = document.querySelector('.sign-up-email-input');
    const passwordInput = document.querySelector('.sign-up-passwd-input');
    const passwordCheckInput = document.querySelector('.sign-up-passwdck-input');
    const nicknameInput = document.querySelector('.sign-up-name-input');
    const profileInput = document.getElementById('profileInput');
    const profilePreview = document.querySelector('.profile-img'); //? , wrapper는 css에 없음.
    const signUpButton = document.querySelector('.sign-up-button');
    const emailHelper = document.querySelector('.sign-up-email-helper');
    const passwordHelper = document.querySelector('.sign-up-passwd-helper');
    const passwordCheckHelper = document.querySelector('.sign-up-passwdck-helper');
    const nicknameHelper = document.querySelector('.sign-up-name-helper');
    const profileHelper = document.querySelector('.profile-helper');
    const addIcon = document.querySelector('.upload-button span'); // '+' 아이콘 선택
    const mainButton = document.querySelector('.header-title');
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(function(menuItem) {
        menuItem.addEventListener('mouseover', function() {
            menuItem.style.backgroundColor = '#E9E9E9';
        });

        menuItem.addEventListener('mouseout', function() {
            menuItem.style.backgroundColor = '#d9d9d9';
        });
    });

    mainButton.addEventListener('click', function(){
        window.location.href = 'checkpostlist.html';
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }

    //이메일, 닉네임, 비밀번호 유효성 검사 및 버튼 색상, 그저 함수
    function checkAllValidations() {
        const isEmailValid = validateEmail(emailInput.value) && emailInput.value !== '';
        const isPasswordValid = validatePassword(passwordInput.value);
        const isPasswordMatching = passwordInput.value === passwordCheckInput.value;
        const isNicknameValid = nicknameInput.value !== '' && !nicknameInput.value.includes(' ') && nicknameInput.value.length <= 10;
        const isProfileUploaded = profileInput.files.length > 0;

        if (isEmailValid && isPasswordValid && isPasswordMatching && isNicknameValid ) {//&& isProfileUploaded 프로필 추가.
            signUpButton.style.backgroundColor = '#7F6AEE';
            signUpButton.disabled = false;
        // Assuming this should be the action on click
        } else {
            signUpButton.style.backgroundColor = '#ACA0EB';
            signUpButton.disabled = true; // Prevent navigation
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        profileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // 프로필 이미지를 배경으로 설정
                    profilePreview.style.backgroundImage = `url(${e.target.result})`;
                    profilePreview.style.backgroundSize = 'cover';
                    profilePreview.style.backgroundPosition = 'center';
                    profileHelper.style.display = 'none'; // 헬퍼 텍스트 숨기기
                    addIcon.style.display = 'none'; // '+' 아이콘 숨기기
                };
                reader.readAsDataURL(file);
            } else {
                alert('유효한 이미지 파일을 선택해주세요.');
            }
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


    emailInput.addEventListener('focusout', async function() { // async 추가
        checkAllValidations(); 
    
        let isEmailDuplicated = false; // 초기화 위치 변경
        // if (emailInput.value !== '') { // 불필요한 fetch를 방지하기 위해 빈 값 체크
        //     try {
        //         const response = await fetch("./data/userdata.json");
        //         const data = await response.json();
        //         isEmailDuplicated = data.some(user => user.email === emailInput.value);
        //     } catch (error) {
        //         console.log('Error', error);
        //     }
        // }
    
        if (emailInput.value === '') {
            emailHelper.innerText = '*이메일을 입력해주세요';
        } else if (!validateEmail(emailInput.value)) {
            emailHelper.innerText = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        } else if (isEmailDuplicated) {
            emailHelper.innerText = '*중복된 이메일입니다.';
        } else { 
            emailHelper.innerText = ''
        } 
        checkAllValidations(); 
    });
    

    passwordInput.addEventListener('focusout', function() {
        if (passwordInput.value === '') {
            passwordHelper.innerText = '*비밀번호를 입력해주세요.';
        } else if (!validatePassword(passwordInput.value)) {
            passwordHelper.innerText = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        } else {
            passwordHelper.innerText = '';
        }
        checkAllValidations();
    });

    passwordCheckInput.addEventListener('focusout', function() {
        if (passwordCheckInput.value !== passwordInput.value) {
            passwordCheckHelper.innerText = '*비밀번호가 다릅니다.';
        } else {
            passwordCheckHelper.innerText = '';
        }
        checkAllValidations();
    });

    nicknameInput.addEventListener('focusout', function() {
        if (nicknameInput.value === '') {
            nicknameHelper.innerText = '*닉네임을 입력해주세요.';
        } else if (nicknameInput.value.includes(' ')) {
            nicknameHelper.innerText = '*띄어쓰기를 없애주세요.';
        } else if (nicknameInput.value.length > 10) {
            nicknameHelper.innerText = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        } else {
            nicknameHelper.innerText = ''; // Assuming API call for nickname check is not required
        }
    });

    
    signUpButton.addEventListener('click', async (event) => {
        if (!signUpButton.disabled) {
            const profileImage = profileInput.files[0];
            const reader = new FileReader();
    
            reader.onload = async function (e) {
                try {
                    const base64Image = e.target.result;
                    const response = await fetch('http://localhost:3001/users/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: emailInput.value,
                            password: passwordInput.value,
                            nickname: nicknameInput.value,
                            image: base64Image
                        })
                    });
    
                    if (response.ok) {
                        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
                        window.location.href = 'login.html';
                    } else {
                        const result = await response.json();
                        alert('회원가입 실패: ' + result.message);
                    }
                } catch (error) {
                    alert('회원가입 과정에서 오류가 발생했습니다: ' + error);
                }
            };
    
            reader.readAsDataURL(profileImage);
        } else {
            alert('모든 필드를 올바르게 채우고 유효성 검사를 통과해야 합니다.');
        }
    });


    document.addEventListener('DOMContentLoaded', checkAllValidations);

    // Additional input validation checks on focus out
    emailInput.addEventListener('focusout', checkAllValidations);
    passwordInput.addEventListener('focusout', checkAllValidations);
    passwordCheckInput.addEventListener('focusout', checkAllValidations);
    nicknameInput.addEventListener('focusout', checkAllValidations);
    profileInput.addEventListener('change', checkAllValidations);