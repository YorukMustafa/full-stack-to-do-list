package com.mustafayoruk.todolistfullstack.service.impl;

import com.mustafayoruk.todolistfullstack.entitys.Tasks;
import com.mustafayoruk.todolistfullstack.repositorys.ITasksRepositorys;
import com.mustafayoruk.todolistfullstack.service.ITasksService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TasksService implements ITasksService {

    private final ITasksRepositorys iTasksRepositorys;

    public TasksService(ITasksRepositorys iTasksRepositorys) {
        this.iTasksRepositorys = iTasksRepositorys;
    }

    @Override
    public List<Tasks> getAllTasks() {
      List<Tasks> task=  iTasksRepositorys.findAll();
     return  task;

    }


    @Override
    public List<Tasks> getTasksByStatus(Boolean isFinished) {
        if (isFinished == null) {
            return iTasksRepositorys.findAll();
        }
        return iTasksRepositorys.findByIsFinished(isFinished);
    }

    @Override
    public Boolean dellTasks(Long id) {
        Optional<Tasks> task = iTasksRepositorys.findById(id);
        if (task.isPresent()) {
            iTasksRepositorys.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Tasks createTasks(Tasks task) {
        Tasks newTask=new Tasks();

        newTask.setHeader(task.getHeader());
        newTask.setDescription(task.getDescription());
        newTask.setIsFinished(false);

        iTasksRepositorys.save(newTask);

        return newTask;
    }

    @Override
    public Tasks updateTasks(Long id, Tasks task) {
        Optional<Tasks> optionalTask = iTasksRepositorys.findById(id);
        if (optionalTask.isPresent()) {
            Tasks existingTask = optionalTask.get();
            existingTask.setHeader(task.getHeader());
            existingTask.setDescription(task.getDescription());
            existingTask.setIsFinished(task.getIsFinished());
            return iTasksRepositorys.save(existingTask);
        }
        throw new RuntimeException("Task bulunamadı!");
    }
}
