import React,{useEffect,useMemo,useState}from'react';import{BookOpen,Search,Download,FileText,ChevronRight,ArrowLeft,GraduationCap,Brain,Shield,Upload,Plus,Trash2,MessageSquare,Calendar,Menu,X,ExternalLink}from'lucide-react';import{api,getCourses,getPapers,getNotices,adminHeaders}from'./api';
const semesters=[1,2,3,4,5,6];const categories=['Mid-1','Mid-2','Semester','Practicals','Model Papers'];const years=[2026,2025,2024,2023,2022,2021,2020,2019];
export default function App(){const[courses,setCourses]=useState([]),[notices,setNotices]=useState([]),[papers,setPapers]=useState([]),[course,setCourse]=useState(null),[sem,setSem]=useState(null),[cat,setCat]=useState(null),[year,setYear]=useState(null),[query,setQuery]=useState(''),[searchResults,setSearchResults]=useState(null),[loading,setLoading]=useState(false),[admin,setAdmin]=useState(false),[adminKey,setAdminKey]=useState(''),[noticeTitle,setNoticeTitle]=useState(''),[noticeMessage,setNoticeMessage]=useState(''),[courseName,setCourseName]=useState(''),[courseDept,setCourseDept]=useState(''),[paperSubject,setPaperSubject]=useState(''),[paperYear,setPaperYear]=useState('2025'),[paperCategory,setPaperCategory]=useState('Semester'),[paperSem,setPaperSem]=useState('1'),[paperCourse,setPaperCourse]=useState(''),[paperFile,setPaperFile]=useState(null),[aiTopic,setAiTopic]=useState(''),[aiResult,setAiResult]=useState(''),[aiLoading,setAiLoading]=useState(false),[mobileMenu,setMobileMenu]=useState(false);
useEffect(()=>{getCourses().then(r=>setCourses(r.data)).catch(()=>{});getNotices().then(r=>setNotices(r.data)).catch(()=>{});},[]);
const resetBrowse=()=>{setCourse(null);setSem(null);setCat(null);setYear(null);setPapers([]);setSearchResults(null);};
const search=async(e)=>{e?.preventDefault();if(!query.trim())return;setLoading(true);try{const r=await getPapers({q:query});setSearchResults(r.data);}catch{setSearchResults([]);}finally{setLoading(false);}};
const selectYear=async(y)=>{setYear(y);setLoading(true);try{const r=await getPapers({courseId:course.id,semester:sem,category:cat,year:y});setPapers(r.data);}catch{setPapers([]);}finally{setLoading(false);}};
const download=async(p)=>{try{await api.post(`/papers/${p.id}/download`);}catch{}window.open((import.meta.env.VITE_API_URL||'http://localhost:8080/api').replace(/\/api$/,'')+p.fileUrl,'_blank','noopener');};
const addCourse=async(e)=>{e.preventDefault();try{const r=await api.post('/courses',{name:courseName,shortName:courseName,department:courseDept,description:'',active:true},{headers:adminHeaders(adminKey)});setCourses([...courses,r.data]);setCourseName('');setCourseDept('');alert('Course added');}catch(err){alert(err.response?.data?.message||'Unable to add course. Check admin key.');}};
const deleteCourse = async (id) => {
  if (!confirm("Are you sure you want to delete this programme?")) {
    return;
  }

  try {
    await api.delete(`/courses/${id}`, {
      headers: adminHeaders(adminKey),
    });

    setCourses((prev) => prev.filter((c) => c.id !== id));

    if (course?.id === id) {
      resetBrowse();
    }

    alert("Programme deleted successfully");
  } catch (err) {
    alert(
      err.response?.data?.message ||
        "Programme deletion failed. Check admin key."
    );
  }
};
const addNotice=async(e)=>{e.preventDefault();try{const r=await api.post('/notices',{title:noticeTitle,message:noticeMessage,tag:'Notice',active:true},{headers:adminHeaders(adminKey)});setNotices([r.data,...notices]);setNoticeTitle('');setNoticeMessage('');}catch(err){alert(err.response?.data?.message||'Notice save failed');}};
const uploadPaper=async(e)=>{e.preventDefault();if(!paperFile){alert('Select a PDF first');return;}const fd=new FormData();fd.append('courseId',paperCourse);fd.append('semester',paperSem);fd.append('category',paperCategory);fd.append('year',paperYear);fd.append('subject',paperSubject);fd.append('file',paperFile);try{await api.post('/papers/upload',fd,{headers:{...adminHeaders(adminKey),'Content-Type':'multipart/form-data'}});alert('Paper uploaded');e.target.reset();setPaperFile(null);}catch(err){alert(err.response?.data?.message||'Upload failed. Check admin key, backend and file.');}};
const askAI=async(e)=>{e.preventDefault();setAiLoading(true);setAiResult('');try{const r=await api.post('/ai/study-insights',{topic:aiTopic,context:'P.B. Siddhartha College previous exam paper portal'});setAiResult(r.data.result||r.data.message||r.data.error||'No response');}catch{setAiResult('AI request failed. Configure GEMINI_API_KEY in backend settings.');}finally{setAiLoading(false);}};
const deleteNotice=async(id)=>{if(!confirm('Delete this notice?'))return;try{await api.delete(`/notices/${id}`,{headers:adminHeaders(adminKey)});setNotices(notices.filter(n=>n.id!==id));}catch{alert('Delete failed. Verify admin key.');}};
const deletePaper = async (id) => {
  if (!confirm("Are you sure you want to delete this question paper?")) {
    return;
  }

  try {
    await api.delete(`/papers/${id}`, {
      headers: adminHeaders(adminKey),
    });

    setPapers((prev) => prev.filter((p) => p.id !== id));

    alert("Paper deleted successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Paper deletion failed. Check admin key.");
  }
};
const grouped=useMemo(()=>{const groups={};courses.forEach(c=>{const k=c.department||'Other';groups[k]??=[];groups[k].push(c);});return groups;},[courses]);
return <div className="app"><header className="nav"><div className="brand" onClick={resetBrowse}><div className="brandicon"><GraduationCap/></div><div><strong>Siddhartha<span>Hub</span></strong><small>ACADEMIC RESOURCE PORTAL</small></div></div><nav className={mobileMenu?'navlinks open':'navlinks'}><a href="#courses" onClick={()=>{resetBrowse();setMobileMenu(false)}}>Courses</a><a href="#notices">Notices</a><a href="#ai">AI Study Assistant</a><button className="adminNav" onClick={()=>{setAdmin(!admin);setMobileMenu(false)}}><Shield size={16}/>{admin?'Student View':'Admin'}</button></nav><button className="menuBtn" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X/>:<Menu/>}</button></header>
<main><section className="hero"><div className="heroText"><div className="eyebrow"><span className="dot"/> STUDY SMARTER · PREP TOGETHER</div><h1>Your academic journey,<br/><em>one paper at a time.</em></h1><p>Explore previous exam papers, find your semester resources, and prepare with confidence.</p><form className="search" onSubmit={search}><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subject, course, paper or year..."/><button>Search</button></form><div className="heroTags"><span><FileText size={15}/> Previous papers</span><span><Download size={15}/> Free downloads</span><span><Brain size={15}/> AI study support</span></div></div><div className="heroArt"><div className="orb orb1"></div><div className="orb orb2"></div><div className="paperStack"><div className="paperTop"><div className="paperMark"><BookOpen/></div><div className="paperLine"/><div className="paperLine short"/><div className="paperTitle">EXAM PREP<br/>COLLECTION</div><div className="paperLine"/><div className="paperLine short"/><div className="paperLine"/><div className="paperLine"/><div className="paperLine short"/></div></div><div className="floatCard"><span className="floatIcon"><FileText/></span><div><b>Past papers</b><small>All semesters · All streams</small></div><span className="floatCheck">✓</span></div><div className="floatBadge"><Brain/><span>AI-ready learning</span></div></div></section>
{searchResults!==null&&<section className="results"><div className="sectionHead"><div><span className="eyebrow">SEARCH</span><h2>Results for “{query}”</h2></div><button className="ghost" onClick={()=>setSearchResults(null)}>Clear</button></div>{loading?'Searching...':searchResults.length===0?<p>No papers found. Try another keyword.</p>:<div className="paperList">{searchResults.map(p=><PaperRow
  key={p.id}
  p={p}
  download={download}
  deletePaper={deletePaper}
  admin={admin}
/>)}</div>}</section>}
<section className="courses section" id="courses"><div className="sectionHead"><div><span className="eyebrow">01 — EXPLORE</span><h2>Find your programme</h2><p>Choose your course to begin browsing papers.</p></div><span className="count">{courses.length} PROGRAMMES</span></div>{course&&<div className="breadcrumbs"><button onClick={()=>{setCourse(null);setSem(null);setCat(null);setYear(null)}}>Programmes</button><ChevronRight/>{course.name}{sem&&<><ChevronRight/><button onClick={()=>{setSem(null);setCat(null);setYear(null)}}>Semester {sem}</button></>}{cat&&<><ChevronRight/>{cat}</>}{year&&<><ChevronRight/>{year}</>}</div>}
{!course?<div className="courseGroups">{Object.entries(grouped).map(([group,list])=><div className="group" key={group}><div className="groupHead"><h3>{group}</h3><span>{list.length} courses</span></div><div className="courseGrid">{list.map((c,i)=><button className="courseCard" key={c.id} onClick={()=>{setCourse(c);setSem(null);setCat(null);setYear(null);setPapers([]);}}><div className="courseIcon" style={{'--accent':colors[i%colors.length]}}><GraduationCap/></div><div className="courseInfo"><b>{c.name}</b><small>{c.shortName||c.department||'Undergraduate programme'}</small></div><ChevronRight className="cardArrow"/></button>)}</div></div>)}</div>:!sem?<div className="semesterGrid">{semesters.map(s=><button className="semesterCard" key={s} onClick={()=>{setSem(s);setCat(null);setYear(null);setPapers([])}}><span className="semesterNo">0{s}</span><b>Semester {s}</b><small>Browse exam resources</small><ChevronRight/></button>)}</div>:!cat?<div className="categoryGrid">{categories.map((c,i)=><button className="categoryCard" key={c} onClick={()=>{setCat(c);setYear(null);setPapers([])}}><div className="categoryIcon">{i===3?<BookOpen/>:<FileText/>}</div><b>{c}</b><small>{c==='Practicals'?'Lab and practical examinations':'Previous examination papers'}</small><ChevronRight/></button>)}</div>:!year?<div className="yearGrid">{years.map(y=><button className="yearCard" key={y} onClick={()=>selectYear(y)}><Calendar/><b>{y}</b><span>View papers</span><ChevronRight/></button>)}</div>:<div className="paperArea"><div className="paperHeading"><div><h3>{course.name}</h3><p>Semester {sem} · {cat} · {year}</p></div><button className="ghost" onClick={()=>setYear(null)}>Change year</button></div>{loading?<p>Loading papers…</p>:papers.length===0?<div className="empty"><FileText/><h3>No papers uploaded yet</h3><p>There are no papers listed for this selection. Admin can upload PDFs from the admin dashboard.</p></div>:<div className="paperList">{papers.map(p => (
  <PaperRow
    key={p.id}
    p={p}
    download={download}
    deletePaper={deletePaper}
    admin={admin}
  />
))}</div>}</div>}</section>
<section className="noticeSection section" id="notices"><div className="sectionHead"><div><span className="eyebrow">02 — CAMPUS UPDATES</span><h2>Notices & announcements</h2><p>Important academic updates shared with students.</p></div><MessageSquare className="sectionIcon"/></div>{notices.length===0?<div className="noticeEmpty">No notices currently. Check back later.</div>:<div className="noticeGrid">{notices.map(n=><article className="noticeCard" key={n.id}><span className="noticeTag">{n.tag||'NOTICE'}</span><h3>{n.title}</h3><p>{n.message}</p><small>{n.createdAt?new Date(n.createdAt).toLocaleDateString():''}</small>{admin&&<button className="deleteNotice" onClick={()=>deleteNotice(n.id)}><Trash2 size={14}/> Delete</button>}</article>)}</div>}</section>
<section className="aiSection section" id="ai"><div className="aiCard"><div className="aiCopy"><span className="eyebrow">03 — AI STUDY LAB</span><h2>Prepare with a<br/><em>little more intelligence.</em></h2><p>Generate a study plan, revise key concepts, and turn a subject into manageable study priorities. AI insights are guidance—not predictions of exact exam questions.</p><div className="aiPills"><span>Study planning</span><span>Topic revision</span><span>Practice priorities</span></div></div><form className="aiForm" onSubmit={askAI}><label>What subject are you preparing for?</label><textarea value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="e.g. Data Structures — Semester 3" required/><button disabled={aiLoading}>{aiLoading?'Generating...':'Generate study insights'}<Brain size={17}/></button>{aiResult&&<div className="aiResult">{aiResult}</div>}</form></div></section>
{admin&&<section className="adminSection section"><div className="sectionHead"><div><span className="eyebrow">ADMIN CONSOLE</span><h2>Manage the portal</h2><p>Only authorized admins should enter the configured admin key.</p></div><Shield/></div><div className="adminKey"><label>Admin key</label><input value={adminKey} onChange={e=>setAdminKey(e.target.value)} type="password" placeholder="Enter ADMIN_KEY configured on backend"/></div><div className="adminGrid"><form className="adminBox" onSubmit={addCourse}><h3><Plus/> Add programme</h3><label>Course name</label><input value={courseName} onChange={e=>setCourseName(e.target.value)} required placeholder="Programme name"/><label>Department / Group</label><input value={courseDept} onChange={e=>setCourseDept(e.target.value)} placeholder="e.g. Computer Science" required/><button className="adminSubmit">Add programme</button></form><form className="adminBox" onSubmit={addNotice}><h3><MessageSquare/> Publish notice</h3><label>Notice title</label><input
  value={noticeTitle}
  onChange={(e) => setNoticeTitle(e.target.value)}
  required
  placeholder="Title"
/><label>Message</label><textarea
  value={noticeMessage}
  onChange={(e) => setNoticeMessage(e.target.value)}
  required
  placeholder="Write the notice..."
/><button className="adminSubmit">Publish notice</button></form><form className="adminBox uploadBox" onSubmit={uploadPaper}><h3><Upload/> Upload paper PDF</h3><label>Programme</label><select value={paperCourse} onChange={e=>setPaperCourse(e.target.value)} required><option value="">Select programme</option>{courses.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select><div className="adminFields"><div><label>Semester</label><select value={paperSem} onChange={e=>setPaperSem(e.target.value)}>{semesters.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label>Year</label><input type="number" value={paperYear} onChange={e=>setPaperYear(e.target.value)} required/></div></div><label>Exam category</label><select value={paperCategory} onChange={e=>setPaperCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><label>Subject name</label><input
  value={paperSubject}
  onChange={(e) => setPaperSubject(e.target.value)}
  required
  placeholder="Subject"
/><label>PDF file</label><input type="file" accept="application/pdf,.pdf" onChange={e=>setPaperFile(e.target.files?.[0]||null)} required/><button className="adminSubmit">Upload paper</button></form></div></section>}
</main><footer><div className="footerBrand"><div className="brandicon"><GraduationCap/></div><b>Siddhartha<span>Hub</span></b></div><p>Student-powered academic resources · P.B. Siddhartha College of Arts & Science</p><div className="footerLinks"><a href="https://www.pbsiddhartha.ac.in/" target="_blank" rel="noreferrer">Official College Website <ExternalLink size={14}/></a><span>Made for students, by students.</span></div></footer></div>}
const colors=['#89a5f8','#70d7c0','#e7b36b','#b29df7','#ef9caa','#7ac5e5'];

function PaperRow({ p, download, deletePaper, admin }) {
  return (
    <div className="paperRow">
      <div className="pdfIcon">
        <FileText />
      </div>

      <div className="paperMeta">
        <b>{p.subject || p.title || "Question paper"}</b>
        <small>
          {p.subjectCode || "Paper"} · {p.regulation || "All regulations"} · {p.year} · Semester {p.semester}
        </small>
      </div>

      <span className="paperCategory">{p.category}</span>

      <button className="downloadBtn" onClick={() => download(p)}>
        <Download size={16} /> PDF
      </button>

      {admin && (
        <button
          className="deleteNotice"
          onClick={() => deletePaper(p.id)}
        >
          <Trash2 size={14} /> Delete
        </button>
      )}
    </div>
  );
}

