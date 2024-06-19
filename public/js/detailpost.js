"use strict";

var editButton = document.querySelector('.content-edit-button');
var viewCount = document.querySelector('.content-view-button p');
var commentCount = document.querySelector('.content-comment-button p');
var commentInput = document.querySelector('.comment-box-content');
var commentSubmitButton = document.querySelector('.comment-box-submit-button');
var contentModal = document.querySelector('.content-delete-modal');
const contentModalOpen = document.querySelector('.content-delete-button');
const contentModalCancel = document.querySelector('.content-delete-modal-cancel');
const contentModalConfirm = document.querySelector('.content-delete-modal-confirm')
const commentModal = document.querySelector('.comment-delete-modal');
const commentModalCancel = document.querySelector('.comment-delete-modal-cancel');
const commentModalConfirm = document.querySelector('.comment-delete-modal-confirm')
const mainButton = document.querySelector('.header-title');
var isEditing = false;
var currentEditingComment = null;
var currentCommentId = null;

mainButton.addEventListener('click', function(){
    window.location.href = 'checkpostlist.html';
});

//헤더 프로필 이미지 호버 배경 변경
const menuItems = document.querySelectorAll('.menu-item');

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
        window.location.href = 'modifyinfo.html';
    });

    // 두 번째 menu-item (비밀번호수정)에 클릭 이벤트 추가
    menuItems[1].addEventListener('click', function() {
        window.location.href = 'modifypasswd.html';
    });

    // 세 번째 menu-item (로그아웃)에 클릭 이벤트 추가
    menuItems[2].addEventListener('click', function() {
        window.location.href = 'login.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const imageElement = document.querySelector('.content-thumbnail');

    // 게시글 불러오기
    fetch('http://localhost:3001/posts')
        .then(response => response.json())
        .then(data => {
            const post = data.find(post => post.id == postId);
            if (post) {
                document.querySelector('.content-title').textContent = post.title;
                document.querySelector('.content-author p').textContent = post.nickname;
                document.querySelector('.content-author-date').textContent = post.createtime;
                document.querySelector('.content-paragraph').textContent = post.content;
                document.querySelector('.content-author-img').src = post.profile_image;
                imageElement.src = `http://localhost:3001${post.image}`;
                imageElement.style.width = '100%';  // 이미지의 너비를 부모 요소의 100%로 설정
                imageElement.style.height = 'auto';  // 이미지의 높이를 자동으로 조정
                imageElement.style.objectFit = 'contain';  // 이미지 비율을 유지하면서 요소에 맞춤
                document.querySelector('.content-view-button p:first-child').textContent = formatCount(Number(post.views));
                document.querySelector('.content-comment-button p:first-child').textContent = formatCount(Number(post.comments));
            }

            // 게시글 수정 버튼 이벤트 추가
            editButton.addEventListener('click', function() {
                localStorage.setItem('editingPost', JSON.stringify(post));
                window.location.href = `modifypost.html?postId=${post.id}`;
            });
        })
        .catch(error => console.error('Error loading post data:', error));
    
    // 댓글 불러오기
    fetch('http://localhost:3001/comments', {
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('로그인 필요');
        }
    })
    .then(comments => {
        const commentsForPost = comments.filter(comment => comment.postId == postId);
        const commentsContainer = document.querySelector('.comment-footer');
            
        // 기존 게시글 데이터 제거
        while (commentsContainer.firstChild) {
            commentsContainer.removeChild(commentsContainer.firstChild);
        }

        commentsForPost.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-author-wrapper');
            commentElement.innerHTML = `
            <div class="comment-author">
                <div class="comment-author-header">
                    <div class="comment-author-profile">
                        <p>${comment.nickname}</p>
                    </div>
                    <div class="comment-author-date">${comment.createtime}</div>
                </div>
            <div class="comment-author-content">${comment.content}</div>
            </div>
            <div class="comment-button">
                <button class="comment-edit-button" data-commentid="${comment.commentId}">수정</button>
                <button class="comment-delete-button" data-commentid="${comment.commentId}">삭제</button>
            </div>
            `;

            commentsContainer.appendChild(commentElement);

            // 댓글 삭제 버튼 이벤트 추가
            // 댓글 삭제 버튼 이벤트 추가
            commentElement.querySelector('.comment-delete-button').addEventListener('click', function() {
                commentModal.style.display = 'block';
                commentModalConfirm.onclick = async () => {
                    try {
                        const response = await fetch(`http://localhost:3001/comments/${comment.commentId}`, {
                            method: 'DELETE',
                            credentials: 'include', // 세션 쿠키를 함께 전송
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: comment.userId // 댓글 작성자의 userId를 전송
                            })
                        });
                        if (response.ok) { 
                            alert('삭제되었습니다.');
                            commentsContainer.removeChild(commentElement);
                            commentModal.style.display = 'none';
                        } else {
                            alert('삭제 실패.');
                            commentModal.style.display = 'none';
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('삭제 중 에러가 발생했습니다.');
                        commentModal.style.display = 'none';                        
                    }
                };
                commentModalCancel.onclick = () => {
                    commentModal.style.display = 'none';
                };
            });


            // 댓글 수정 버튼 이벤트 추가
            commentElement.querySelector('.comment-edit-button').addEventListener('click', function() {
                isEditing = true;
                currentEditingComment = commentElement.querySelector('.comment-author-content');
                currentCommentId = comment.commentId;
                var originalContent = currentEditingComment.textContent;
                commentInput.value = originalContent;
                commentSubmitButton.textContent = '댓글 수정';
                commentSubmitButton.style.backgroundColor = '#7F6AEE';
            });
        });
    })
    .catch(error => console.error('Error loading comments:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    commentSubmitButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const commentContent = commentInput.value.trim();

        if (!commentContent) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('postId');

        if (isEditing) {
            // 댓글 수정 로직
            try {
                const response = await fetch(`http://localhost:3001/comments/${currentCommentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ content: commentContent })
                });

                if (response.ok) {
                    alert('댓글이 수정되었습니다.');
                    currentEditingComment.textContent = commentContent;
                    // 초기화
                    isEditing = false;
                    currentEditingComment = null;
                    currentCommentId = null;
                    commentInput.value = '';
                    commentSubmitButton.textContent = '댓글 작성';
                    commentSubmitButton.style.backgroundColor = '';
                    document.location.reload(true); // 페이지 새로 고침
                } else {
                    alert('댓글 수정 실패. 서버에서 문제가 발생했습니다.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('댓글 수정 중 에러가 발생했습니다.');
            }
        } else {
            // 댓글 등록 로직
            try {
                const data = {
                    postId: postId,
                    content: commentContent
                };

                const response = await fetch('http://localhost:3001/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('댓글이 성공적으로 등록되었습니다.', result);
                    document.location.reload(true); // 페이지 새로 고침
                } else {
                    alert('댓글 등록 실패. 서버에서 문제가 발생했습니다.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('댓글 등록 중 에러가 발생했습니다.');
            }
        }
    });

    commentInput.addEventListener('input', function() {
        if (commentInput.value.trim() === '') {
            commentSubmitButton.style.backgroundColor = '#ACA0EB';
        } else {
            commentSubmitButton.style.backgroundColor = '#7F6AEE';
        }
    });
});

// 조회수, 댓글 k 로직
function formatCount(count) {
    if (count >= 100000) {
        return (count / 1000).toFixed(0) + 'k';
    } else if (count >= 10000) {
        return (count / 1000).toFixed(0) + 'k';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(0) + 'k';
    } else {
        return count.toString();
    }
}



    //게시글 삭제 모달 오픈
    contentModalOpen.addEventListener('click',function(){
    //display 속성을 block로 변경
        contentModal.style.display = 'block';
    });

    //게시글 삭제 취소
    contentModalCancel.addEventListener('click',function(){
    //display 속성을 none으로 변경
        contentModal.style.display = 'none';
    });

    //게시글 삭제
contentModalConfirm.addEventListener('click', async function(){   
    // URL에서 postId 파라미터 값을 가져옵니다.
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('postId');
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: 'DELETE',
            });
            if (response.ok) { // 성공적으로 삭제되었을 때
                alert('삭제되었습니다.');
                contentModal.style.display = 'none';
                window.location.href = 'checkpostlist.html';
                // 삭제 후, 홈페이지나 다른 페이지로 리다이렉트 할 수 있습니다.
                // 예: window.location.href = 'index.html';
            } else {
                // 서버에서 문제가 발생했을 때의 처리
                alert('삭제 실패. 서버에 문제가 발생했습니다.');
                
            }
        } catch (error) {
            console.error('Error:', error);
            alert('삭제 중 에러가 발생했습니다.');
        }
    });





