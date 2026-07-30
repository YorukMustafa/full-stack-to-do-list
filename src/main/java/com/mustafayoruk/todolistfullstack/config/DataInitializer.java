package com.mustafayoruk.todolistfullstack.config;

import com.mustafayoruk.todolistfullstack.entitys.Roles;
import com.mustafayoruk.todolistfullstack.repositorys.IRolesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final IRolesRepository iRolesRepository;

    public DataInitializer(IRolesRepository iRolesRepository) {
        this.iRolesRepository = iRolesRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (iRolesRepository.count() == 0) {
            Roles userRole = new Roles();
            userRole.setName("USER");
            iRolesRepository.save(userRole);

            Roles adminRole = new Roles();
            adminRole.setName("ADMIN");
            iRolesRepository.save(adminRole);

            System.out.println(">>> Initial roles (USER, ADMIN) created in PostgreSQL database.");
        }
    }
}
