package com.mustafayoruk.todolistfullstack.repositorys;

import com.mustafayoruk.todolistfullstack.entitys.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUsersRepositorys extends JpaRepository<Users,Long> {
}
