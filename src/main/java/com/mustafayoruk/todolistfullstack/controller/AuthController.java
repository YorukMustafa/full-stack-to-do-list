package com.mustafayoruk.todolistfullstack.controller;

import com.mustafayoruk.todolistfullstack.dto.DtoUsers;
import com.mustafayoruk.todolistfullstack.jwt.AuthRequest;
import com.mustafayoruk.todolistfullstack.jwt.AuthResponse;
import com.mustafayoruk.todolistfullstack.service.IAuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/api/auth/controller")
public class AuthController {

    private final IAuthService iAuthService;


    public AuthController(IAuthService iAuthService) {
        this.iAuthService = iAuthService;
    }

    @PostMapping("/register")
    public DtoUsers register(@RequestBody AuthRequest request){

        return  iAuthService.register(request);

    }
    @PostMapping("/authenticate")
    public AuthResponse authenticate(@RequestBody AuthRequest request){

        return  iAuthService.authenticate(request);

    }
}