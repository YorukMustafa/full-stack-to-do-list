package com.mustafayoruk.todolistfullstack.mapper;

import com.mustafayoruk.todolistfullstack.dto.DtoUsers;
import com.mustafayoruk.todolistfullstack.entitys.Users;
import com.mustafayoruk.todolistfullstack.jwt.AuthRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper  {

    Users requestToEntity(AuthRequest request);

    DtoUsers entityToDto(Users user);
}