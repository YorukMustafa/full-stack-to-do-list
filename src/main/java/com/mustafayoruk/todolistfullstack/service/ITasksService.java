package com.mustafayoruk.todolistfullstack.service;

import com.mustafayoruk.todolistfullstack.entitys.Tasks;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ITasksService {

    List<Tasks> getAllTasks();



     List<Tasks> getTasksByStatus(Boolean isFinished);

    Boolean dellTasks(Long id);

    Tasks createTasks( Tasks task);

    Tasks updateTasks( Long id ,Tasks task);
}
