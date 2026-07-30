package com.mustafayoruk.todolistfullstack.repositorys;

import com.mustafayoruk.todolistfullstack.entitys.Tasks;
import com.mustafayoruk.todolistfullstack.entitys.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITasksRepositorys extends JpaRepository<Tasks,Long> {
    List<Tasks> findByIsFinished(Boolean isFinished);
    List<Tasks> findByUser(Users user);
    List<Tasks> findByUserAndIsFinished(Users user, Boolean isFinished);
}
