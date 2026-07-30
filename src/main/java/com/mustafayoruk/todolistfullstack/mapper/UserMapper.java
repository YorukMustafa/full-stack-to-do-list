package com.mustafayoruk.todolistfullstack.mapper;

import com.mustafayoruk.todolistfullstack.dto.DtoUsers;
import com.mustafayoruk.todolistfullstack.entitys.Users;
import com.mustafayoruk.todolistfullstack.jwt.AuthRequest;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public Users requestToEntity(AuthRequest request) {
        if (request == null) return null;
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        return user;
    }

    public DtoUsers entityToDto(Users user) {
        if (user == null) return null;
        DtoUsers dtoUsers = new DtoUsers();
        dtoUsers.setUsername(user.getUsername());
        return dtoUsers;
    }
}