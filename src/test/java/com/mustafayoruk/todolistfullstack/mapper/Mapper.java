package com.mustafayoruk.todolistfullstack.mapper;

@Mapper(componentModel = "spring")
public interface UserMapper  {

    // 1. KURAL: Dışarıdan gelen AuthRequest'i (DTO), Veritabanı User'ına çevir
    Users requestToEntity(AuthRequest request);

    // 2. KURAL: Veritabanındaki User'ı al, dışarıya verilecek DtoUser'a çevir
    DtoUsers entityToDto(Users user);
}