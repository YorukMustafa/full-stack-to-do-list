package com.mustafayoruk.todolistfullstack.service;

import com.mustafayoruk.todolistfullstack.dto.DtoUsers;
import com.mustafayoruk.todolistfullstack.jwt.AuthRequest;
import com.mustafayoruk.todolistfullstack.jwt.AuthResponse;

public interface IAuthService {

    DtoUsers register(AuthRequest request);

    AuthResponse authenticate(AuthRequest request);
}
