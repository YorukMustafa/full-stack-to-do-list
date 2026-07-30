package com.mustafayoruk.todolistfullstack.service.impl;

import com.mustafayoruk.todolistfullstack.entitys.Tasks;
import com.mustafayoruk.todolistfullstack.entitys.Users;
import com.mustafayoruk.todolistfullstack.repositorys.ITasksRepositorys;
import com.mustafayoruk.todolistfullstack.repositorys.IUsersRepositorys;
import com.mustafayoruk.todolistfullstack.service.ITasksService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TasksService implements ITasksService {

    private final ITasksRepositorys iTasksRepositorys;
    private final IUsersRepositorys iUsersRepositorys;

    public TasksService(ITasksRepositorys iTasksRepositorys, IUsersRepositorys iUsersRepositorys) {
        this.iTasksRepositorys = iTasksRepositorys;
        this.iUsersRepositorys = iUsersRepositorys;
    }

    private Users getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return iUsersRepositorys.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
    }

    @Override
    public List<Tasks> getAllTasks() {
        Users currentUser = getCurrentUser();
        return iTasksRepositorys.findByUser(currentUser);
    }

    @Override
    public List<Tasks> getTasksByStatus(Boolean isFinished) {
        Users currentUser = getCurrentUser();
        if (isFinished == null) {
            return iTasksRepositorys.findByUser(currentUser);
        }
        return iTasksRepositorys.findByUserAndIsFinished(currentUser, isFinished);
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
        Users currentUser = getCurrentUser();
        Tasks newTask = new Tasks();

        newTask.setHeader(task.getHeader());
        newTask.setDescription(task.getDescription());
        newTask.setIsFinished(false);
        newTask.setUser(currentUser);

        return iTasksRepositorys.save(newTask);
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
