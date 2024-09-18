<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.HttpURLConnection, java.net.URL, java.io.BufferedReader, java.io.InputStreamReader, org.json.JSONObject, org.json.JSONArray" %>
<!DOCTYPE html>
<html>
<head>
    <title>Tag List</title>
</head>
<body>
    <h1>Tag List</h1>
    <%
        String apiUrl = "https://api.example.com/tags"; // Replace with your actual API endpoint
        String result = "";
        
        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            
            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                
                JSONObject jsonResponse = new JSONObject(response.toString());
                
                // Check for a basic message in the response
                if (jsonResponse.has("message") && jsonResponse.getString("message").equals("success")) {
                    JSONArray tags = jsonResponse.getJSONArray("tags");
                    
                    result += "<ul>";
                    for (int i = 0; i < tags.length(); i++) {
                        result += "<li>" + tags.getString(i) + "</li>";
                    }
                    result += "</ul>";
                } else {
                    result = "Error: Unexpected response format";
                }
            } else {
                result = "Error: HTTP response code " + responseCode;
            }
        } catch (Exception e) {
            result = "Error: " + e.getMessage();
        }
    %>
    
    <div id="tagList">
        <%= result %>
    </div>
</body>
</html>
