"use strict";

const loginWrapperElem = document.querySelector('.body-wrapper')
const emailInput = document.querySelector('.body-email-input')
const passwordInput = document.querySelector('.body-passwd-input')
const loginButton = document.querySelector('.login-button')
const helperText = document.querySelector('.body-passwd-helper');
const signUpLink = document.querySelector('.go-signup')


// 이메일 유효성 검사

function validateEmail(email) {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if(pattern.test(email) === false) {return false;}
    else { return true; }
}

// 비밀번호 유효성 검사
function validatePassword(password){
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return pattern.test(password);
}

loginWrapperElem.addEventListener('keyup', () => {

    if (emailInput.value && passwordInput.value) {  
        loginButton.style.backgroundColor = '#7F6AEE';
    } else{  
        loginButton.style.backgroundColor = '#ACA0EB';
    }
});


//로그인 버튼 유효성 검사
loginButton.addEventListener('click', async function(e){
    e.preventDefault();
    const email = emailInput.value.trim(); // 공백 제거 한 후 email 에 저장
    const password = passwordInput.value.trim();

    if (!email || email.length < 5 || !validateEmail(email)){
        helperText.textContent = '올바른 이메일 주소 형식을 입력해주세요.(예: example@example.com)';
        return;
    }
    if (!password){
        helperText.textContent = '*비밀번호를 입력해주세요.';
        return;
    }

    if (!validatePassword(password)){
        helperText.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야합니다.';
        return;
    }
    //to do: 비밀번호 안보이게 설정 추가

    //여기서 서버에 로그인 요청을 보내야함. post로 로그인 요청
    try {
        const response = await fetch(`http://localhost:3001/users/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            alert('로그인 성공!');
            window.location.href = "checkpostlist.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('로그인 에러:', error);
        alert('로그인 중 문제가 발생했습니다.');
    }
});


