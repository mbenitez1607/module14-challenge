const newFormHandler = async (event) => {

    event.preventDefault();

    const title = document.querySelector('input[name="title"]').value;
    const contents = document.querySelector('textarea[name="contents"]').value;

    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
        title,
        contents
        }),
        headers: {
        'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.new-blog-form').addEventListener('submit', newFormHandler);
