package edu.pbs.hub.model;
import jakarta.persistence.*;
@Entity @Table(name="courses") public class Course {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String name;
 private String shortName; private String department; private String description; private boolean active=true;
 public Course(){} public Course(String name,String shortName,String department,String description){this.name=name;this.shortName=shortName;this.department=department;this.description=description;}
 public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;} public String getShortName(){return shortName;} public void setShortName(String v){shortName=v;} public String getDepartment(){return department;} public void setDepartment(String v){department=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}
