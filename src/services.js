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

export const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(`categories/${id}`)
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
      .get(`categories/products/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const addOrUpdateProduct = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`products`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getProductsById = (id) => {
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

export const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(`products/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const searchProductsByName = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`product/searchByName`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateBulkDiscount = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`updateDiscounts`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateBulkPriceByPercentage = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`updatePrice`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

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

export const removeFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/destroy`,
      {
        method: 'POST',
        body: JSON.stringify({ public_id }),
        headers: { 'Content-Type': 'application/json' }
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

export const getBanners = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`banners`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addBanner = (data) => {
  return new Promise((resolve, reject) => {
    instance
      .post(`banners`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteBanner = (id) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(`banners/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
