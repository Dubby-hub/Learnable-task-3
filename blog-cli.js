const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');

// Path where blog posts will be stored
const postsDir = path.join(__dirname, 'posts');

// Ensure the "posts" directory exists
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir);
}

// Function to create a new blog post
async function createPost() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the blog post:'
        },
        {
            type: 'input',
            name: 'content',
            message: 'Enter the content of the blog post:'
        }
    ]);

    const postFileName = `${answers.title.replace(/\s+/g, '_')}.txt`; // Replace spaces with underscores
    const postFilePath = path.join(postsDir, postFileName);

    // Write the content to a text file
    fs.writeFileSync(postFilePath, answers.content);

    console.log(`Blog post "${answers.title}" created successfully!`);
}

// Function to list all blog posts
function listPosts() {
    const posts = fs.readdirSync(postsDir);
    if (posts.length === 0) {
        console.log('No blog posts available.');
        return;
    }

    console.log('Listing all blog posts:');
    posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.replace('.txt', '')}`);
    });
}

// Function to delete a blog post
async function deletePost() {
    const posts = fs.readdirSync(postsDir);
    if (posts.length === 0) {
        console.log('No blog posts available to delete.');
        return;
    }

    const postChoices = posts.map((post, index) => ({
        name: post.replace('.txt', ''),
        value: post
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'postToDelete',
            message: 'Select a blog post to delete:',
            choices: postChoices
        }
    ]);

    const postFilePath = path.join(postsDir, answers.postToDelete);

    // Delete the selected post
    fs.unlinkSync(postFilePath);
    console.log(`Blog post "${answers.postToDelete.replace('.txt', '')}" deleted successfully!`);
}

// Main menu function
async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Create a new post', 'List all posts', 'Delete a post', 'Exit']
        }
    ]);

    switch (answers.action) {
        case 'Create a new post':
            await createPost();
            break;
        case 'List all posts':
            listPosts();
            break;
        case 'Delete a post':
            await deletePost();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
            break;
    }

    // After any action, show the main menu again
    mainMenu();
}

// Start the app
mainMenu();