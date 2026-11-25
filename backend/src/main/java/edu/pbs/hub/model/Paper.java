package edu.pbs.hub.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="papers") public class Paper {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Course course;
 @Column(nullable=false) private Integer semester;
 @Column(nullable=false) private String category;
 @Column(nullable=false) private Integer year;
 private String subject; private String subjectCode; private String regulation; private String fileName; private String fileUrl; private String description;
 private LocalDateTime uploadedAt=LocalDateTime.now(); private Long downloads=0L;
 public Paper(){}
 public Long getId(){return id;} public Course getCourse(){return course;} public void setCourse(Course v){course=v;} public Integer getSemester(){return semester;} public void setSemester(Integer v){semester=v;} public String getCategory(){return category;} public void setCategory(String v){category=v;} public Integer getYear(){return year;} public void setYear(Integer v){year=v;} public String getSubject(){return subject;} public void setSubject(String v){subject=v;} public String getSubjectCode(){return subjectCode;} public void setSubjectCode(String v){subjectCode=v;} public String getRegulation(){return regulation;} public void setRegulation(String v){regulation=v;} public String getFileName(){return fileName;} public void setFileName(String v){fileName=v;} public String getFileUrl(){return fileUrl;} public void setFileUrl(String v){fileUrl=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public LocalDateTime getUploadedAt(){return uploadedAt;} public Long getDownloads(){return downloads;} public void incrementDownloads(){downloads=(downloads==null?0:downloads)+1;}
}
