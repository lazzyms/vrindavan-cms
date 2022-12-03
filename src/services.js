import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .put(`login`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getCategories = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`categories`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getCategoryDetails = (id) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`categories/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdateCategories = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`categories`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getProductsByCategoryId = (id) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`products/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const uploadToCloudinary = (data) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
      {
        method: 'POST',
        body: data
      }
    )
      .then((r) => {
        resolve(r.json());
      })
      .catch((err) => {
        console.log('Cloudinary error', err);
        reject(err);
      });
  });
};
