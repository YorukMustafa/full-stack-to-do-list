package com.mustafayoruk.todolistfullstack.repositorys;

import com.mustafayoruk.todolistfullstack.entitys.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITasksRepositorys extends JpaRepository<Tasks,Long> {
    List<Tasks> findByIsFinished(Boolean isFinished);
}
