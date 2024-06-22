import React, { useEffect, useState } from 'react';
import Editor from './Editor';
import './style.css';
import Snackbar from 'awesome-snackbar'
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';


const CreatePage = () => {
  const api = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [categories] = useState(['Technology', 'Science', 'Health', 'Travel', 'Automotive', 'Environment', 'Arts']);

  const handleApi = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('thumbnail', thumbnail);
      formData.append('content', content);
      formData.append('desc', desc);
      let result = await fetch(`${api}blog/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      })
      result = await result.json();
      return result
    }
    catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !content || !thumbnail || !category || !desc) {
      new Snackbar('Please fill in all fields', {
        position: 'bottom-right'
      })
      return;
    }
    handleApi().then((res) => {
      if (res.success) {
        new Snackbar(`<i class="bi bi-check-circle-fill"></i>&nbsp;&nbsp;&nbsp;Blog has been created`, {
          position: 'bottom-center',
          style: {
            container: [
              ['background', 'rgb(130, 249, 103)'],
              ['border-radius', '5px'],
              ['height', '50px'],
              ['padding', '10px'],
              ['border-radius', '20px']
            ],
            message: [
              ['color', 'black'],
              ['font-size', '18px']
            ],
            bold: [
              ['font-weight', 'bold'],
            ],
            actionButton: [
              ['color', 'white'],
            ],
          }
        });
        navigate('/')
      }
    })
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  return (
    <div className='create-root'>
      <h1>Create a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Enter title for your blog'
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            placeholder='Enter Description for your blog'
            required
          />
        </label>

        <label>
          Thumbnail:
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
        </label>

        <label>
          Category:
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="" disabled>Select category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <Editor
          value={content}
          onChange={(newContent) => { const sanitizedValue = DOMPurify.sanitize(newContent); setContent(sanitizedValue) }}
        />
        {/* <div className='ql-editor' dangerouslySetInnerHTML={{__html:content}}></div> */}

        {error && <p className='error'>{error}</p>}

        <div>
          <button type="submit">Create Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
