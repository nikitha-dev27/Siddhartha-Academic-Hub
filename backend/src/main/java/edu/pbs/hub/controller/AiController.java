package edu.pbs.hub.controller;
import org.springframework.web.bind.annotation.*;import org.springframework.beans.factory.annotation.Value;import org.springframework.web.client.RestClient;import java.util.*;
@RestController @RequestMapping("/api/ai") public class AiController { @Value("${app.gemini-key}") private String key; @Value("${app.gemini-model}") private String model; @PostMapping("/study-insights") public Map<String,Object> insights(@RequestBody Map<String,String> body){String topic=body.getOrDefault("topic","previous examination preparation");String context=body.getOrDefault("context","");if(key==null||key.isBlank())return Map.of("enabled",false,"message","AI is not configured. Add GEMINI_API_KEY to the backend environment.");String prompt="You are a responsible academic study assistant. Give a concise study plan and practice focus for: "+topic+". Context: "+context+". Do not claim you know exact upcoming exam questions. Clearly label predictions as practice priorities, not guarantees. Return readable Markdown.";String url="https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent?key="+key;Map payload=Map.of("contents",List.of(Map.of("parts",List.of(Map.of("text",prompt)))));try{Map response=RestClient.create().post().uri(url).body(payload).retrieve().body(Map.class);List candidates=(List)response.get("candidates");Map candidate=(Map)candidates.get(0);Map content=(Map)candidate.get("content");List parts=(List)content.get("parts");Map part=(Map)parts.get(0);return Map.of("enabled",true,"result",part.get("text"));}catch (Exception e) {
    e.printStackTrace();

    return Map.of(
        "enabled", true,
        "error", "Gemini is temporarily busy. Please try again in a few moments."
    );
}} }
