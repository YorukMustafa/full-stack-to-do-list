package com.mustafayoruk.todolistfullstack.controller;

import com.mustafayoruk.todolistfullstack.entitys.Tasks;
import com.mustafayoruk.todolistfullstack.service.ITasksService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Data
@RequestMapping("/rest/api/tasks")
public class TasksController {

    private final ITasksService tasksService;

    public TasksController(ITasksService tasksService) {
        this.tasksService = tasksService;
    }

    @GetMapping("/get-all-tasks")
    private List<Tasks> getAllTasks()
    {
        return tasksService.getAllTasks();

    }
    @GetMapping("/get-tasks-by-status")
    private List<Tasks> getTasksByStatus(@RequestParam Boolean isFinished)
    {
        return tasksService.getTasksByStatus(isFinished);

    }


    @DeleteMapping("/del-tasks/{id}")
    private Boolean dellTasks(@PathVariable  Long id)
    {
        return tasksService.dellTasks(id);
    }


    @PostMapping("/create-new-tasks")
    private Tasks createTasks(@RequestBody Tasks task){
        return tasksService.createTasks(task);
    }

    @PutMapping("/update-tasks/{id}")
    private Tasks updateTasks(@PathVariable Long id,@RequestBody Tasks task){
        return tasksService.updateTasks(id,task);
    }

}
