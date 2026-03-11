import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

function parseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export async function apiRequest(path, options = {}) {
  // Attach Firebase ID token if a user is signed in
  const authHeaders = {};
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const headers = {
    ...jsonHeaders,
    ...authHeaders,
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await parseBody(response);

  if (!response.ok) {
    const error = new Error(body?.message || 'Request failed');
    error.status = response.status;
    error.payload = body;
    throw error;
  }

  return body;
}


export async function fetchPosts() {
  return apiRequest('/posts');
}

export async function fetchPostById(id) {
  return apiRequest(`/posts/${id}`);
}

export async function createPost(payload) {
  return apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updatePost(id, payload) {
  return apiRequest(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deletePost(id) {
  return apiRequest(`/posts/${id}`, {
    method: 'DELETE',
  });
}
