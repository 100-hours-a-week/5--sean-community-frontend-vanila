document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3001/users/session', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('세션 확인 중 에러 발생:', error);
        window.location.href = '/signin.html'; // '/'를 붙여야 도메인 호스트 네임이 붙는다.
    }

    checkSessionStatus();

});

function checkSessionStatus() {
    fetch('http://localhost:3001/users/session', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            console.log('Session is active. User ID:', data.result);
        } else {
            console.log('No active session.');
        }
    })
    .catch(error => {
        console.error('Error checking session status:', error);
    });
}