package com.mustafayoruk.todolistfullstack.repositorys;

import com.mustafayoruk.todolistfullstack.entitys.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRolesRepository extends JpaRepository<Roles,Long> {
}
