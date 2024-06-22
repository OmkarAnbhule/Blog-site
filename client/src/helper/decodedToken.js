import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


const decodedToken = () => {
    return jwtDecode(localStorage.getItem('token'));
};

export default decodedToken
