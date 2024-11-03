
# User Management API

## Technologies Used
- Node.js
- Express.js
- MySql

## API Endpoints

Set Headers for Authorization Key and change value Bearer 

//oauth and check user

### 1. Register User
- **Endpoint**: `POST /register`
- **Description**: Create a new user.
- **Request Body**:
    ```json
    {
      "name": "jason",
      "email": "jason@example.com",
      "password": "securepassword"
    }
    ```
    - **Error (400 Bad Request)**:
        ```json
        {
          "error": "Email already exists"
        }
        ```
### 2. Login User
- **Endpoint**: `POST /login`
- **Description**: login user.
- **Request Body**:
    ```json
    {
      "email": "jason@example.com",
      "password": "securepassword"
    }
    ```
    - **Error (400 Bad Request)**:
        ```json
        {
          "error": "Email already exists"
        }
        ```

### 3. Get All Users
- **Endpoint**: `GET /users`
- **Description**: Retrieve a list of all users.
- **Request Body**:
    ```json
        [
          {
            "id": "1",
            "name": "John Doe",
            "email": "john@example.com"
          },
          {
            "id": "2",
            "name": "Jane Doe",
            "email": "jane@example.com"
          }
        ]
        ```

### 4. Get User By ID
- **Endpoint**: `GET /users/:id`
- **Description**: Retrieve a user by their ID.
- **Request Body**:
    ```json
        {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        }
        ```
    - **Error (404 Not Found)**:
        ```json
        {
          "error": "User not found"
        }
        ```


### 5. Set Role (Seller/Buyer)
- **Endpoint**: `GET /:id/role`
- **Description**: for admin.
- **Request Body**:
    ```json
        {
          "id": "seller"

        }
        ```
// item-shop-manage

### 1. Created Product
- **Endpoint**: `GET /products/create`
- **Description**: for admin , seller.
- **Request Body**:
    ```json

        ```form-data
        
        ```
    - **Error (404 Not Found)**:
        ```json
        {
          "error": "User not found"
        }
        ```

### 2. Edit Product
- **Endpoint**: `GET /users/:id`
- **Description**: for admin , seller.
- **Response**:
    - **Success (200 OK)**:
        ```json
       {
         "name": "dsddssddsdsdsdsds",
        "price": 3500,
         "description": "Updated description",
         "variations": [
               {
                      "id": 1,  
                     "type": "Color",
                    "value": "Red Hawaii",
                     "price": 5000,
                     "options": [
              {
          "id": 2,  
          "value": "xl",
          "stock": 112
              }
           ]
          }
       ]
      }

        ```

### 3. Delete Product
- **Endpoint**: `DELETE /products/products/:id`
- **Description**: .
- **Response**:
    - **Success (200 OK)**:
        ```json
        {
         "message": "Product deleted successfully"
        }
        ```
    - **Error (404 Not Found)**:
        ```json
        {
          "message": "Product not found"
        }
        ```

### 4. Get Product By ID
- **Endpoint**: `GET /products/products/:id`
- **Description**: .
- **Response**:
    - **Success (200 OK)**:
        ```json
       {
        "id": 1,
        "name": "t-shirt ss2024",
        "price": "3500.00",
        "description": "Updated description",
        "gender": "male",
        "sellerId": 1,
        "seller": {
            "id": 1,
            "username": "tarzer"
         },
        "images": [
            {
                "image_url": "public\\products\\1730642598319-833338419.png"
            },
            {
                "image_url": "public\\products\\1730642598324-847996496.png"
            },
            {
                "image_url": "public\\products\\1730642598325-799092979.jpg"
            },
            {
                "image_url": "public\\products\\1730642598326-343257100.jpg"
            },
            {
                "image_url": "public\\products\\1730642598327-484320388.png"
            }
        ],
        "productVariations": [
            {
                "variationType": "Color",
                "variationValue": "Red Hawaii",
                "variationPrice": "5000.00",
                "productVariationOptions": [
                    {
                        "value": "S",
                        "stocks": [
                            {
                                "quantity": 35
                            }
                        ]
                    },
                    {
                        "value": "xl",
                        "stocks": [
                            {
                                "quantity": 112
                            }
                        ]
                    }
                ]
            },
            {
                "variationType": "Color",
                "variationValue": "Blue",
                "variationPrice": "3450.00",
                "productVariationOptions": [
                    {
                        "value": "S",
                        "stocks": [
                            {
                                "quantity": 30
                            }
                        ]
                    },
                    {
                        "value": "L",
                        "stocks": []
                    }
                ]
            }
        ]
       }
        ```
    - **Error (404 Not Found)**:
        ```json
        {
          "error": "Product not found"
        }
        ```
        
### 5. Get All Product
- **Endpoint**: `GET /products/`
- **Description**: .
- **Response**:
    - **Success (200 OK)**:
        ```json
         [
              {
        "id": 2,
        "name": "t-shirt ss2024",
        "price": "1500.00",
        "description": "desc",
        "sellerId": 1,
        "images": [
            {
                "image_url": "public\\products\\1730650164689-384916757.png"
            },
            {
                "image_url": "public\\products\\1730650164693-659220317.png"
            },
            {
                "image_url": "public\\products\\1730650164695-126802315.jpg"
            },
            {
                "image_url": "public\\products\\1730650164696-220578514.jpg"
            },
            {
                "image_url": "public\\products\\1730650164697-656116694.png"
            }
        ],
        "productVariations": [
            {
                "variationType": "Color",
                "variationValue": "Red",
                "variationPrice": "3350.00",
                "productVariationOptions": [
                    {
                        "value": "S",
                        "stocks": [
                            {
                                "quantity": 35
                            }
                        ]
                    },
                    {
                        "value": "M",
                        "stocks": []
                    }
                ]
            },
            {
                "variationType": "Color",
                "variationValue": "Blue",
                "variationPrice": "3450.00",
                "productVariationOptions": [
                    {
                        "value": "S",
                        "stocks": [
                            {
                                "quantity": 30
                            }
                        ]
                    },
                    {
                        "value": "L",
                        "stocks": []
                    }
                ]
            }
        ]
       },
           {
        "id": 3,
        "name": "ultraman t-shirt 2023",
        "price": "7000.00",
        "description": "desc desc",
        "sellerId": 1,
        "images": [
            {
                "image_url": "public\\products\\1730653626391-929987841.png"
            },
            {
                "image_url": "public\\products\\1730653626393-750707214.png"
            },
            {
                "image_url": "public\\products\\1730653626396-687858298.jpg"
            },
            {
                "image_url": "public\\products\\1730653626396-965106550.jpg"
            },
            {
                "image_url": "public\\products\\1730653626398-961522900.png"
            }
        ],
        "productVariations": [
            {
                "variationType": "Color",
                "variationValue": "Red Lava",
                "variationPrice": "4350.00",
                "productVariationOptions": [
                    {
                        "value": "X",
                        "stocks": [
                            {
                                "quantity": 35
                            }
                        ]
                    },
                    {
                        "value": "L",
                        "stocks": []
                    }
                ]
            },
            {
                "variationType": "Color",
                "variationValue": "Blue Ocean",
                "variationPrice": "3450.00",
                "productVariationOptions": [
                    {
                        "value": "S",
                        "stocks": [
                            {
                                "quantity": 30
                            }
                        ]
                    },
                    {
                        "value": "L",
                        "stocks": []
                    }
                ]
            }
        ]
       }
       ]
        ```

//address

### 1. Add Address  
- **Endpoint**: `POST /addresses/addAddress`
- **Description**: login user.
- **Request Body**:
    ```json
     {
       "recipientName": "pimcream",
       "postalAddress": "6666erer saramoto noeyzaza",
        "houseNumber": "12345 pritrabus towmerer",
         "contactNumber": "0812342222"
    }
    ```

### 2. Delete Address
- **Endpoint**: `DELETE /addresses/deleteAddress/:id`
- **Description**: Retrieve a list of all users.
- **Request Body**:
    ```json
        
          {
            "message": "Address deleted successfully"
          },

        ```

### 3. Favorite
- **Endpoint**: `GET /addresses/favoriteAddress/:id`
- **Description**: .
- **Request Body**:
    ```json
            {
    "message": "Address marked as favorite successfully",
    "address": {
        "id": 4,
        "userId": 1,
        "recipientName": "pimcream",
        "postalAddress": "6666erer saramoto noeyzaza",
        "houseNumber": "12345 pritrabus towmerer",
        "contactNumber": "0812342222",
        "Favorite": true,
        "createdAt": "2024-11-03T17:17:36.000Z",
        "updatedAt": "2024-11-03T17:26:16.653Z"
             }
            }
        ```
    - **Error (404 Not Found)**:
        ```json
        {
           "message": "Address not found"
        }
        ```


