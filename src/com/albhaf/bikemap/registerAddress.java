package com.albhaf.bikemap;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class registerAddress extends HttpServlet {
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Date now = new Date();
		
		try {
			if(!request.getParameter("addr").isEmpty() && !request.getParameter("lat").isEmpty() && !request.getParameter("lng").isEmpty()) {
		
				System.out.println("Address registered (" + now.toString() + "): " + request.getParameter("addr") + " " + request.getParameter("lat") + " " + request.getParameter("lng"));
				response.getWriter().println("0");
			} else {
				response.getWriter().println("1");
			}
		} catch (NullPointerException e) {
			response.getWriter().println("1");
		}
		
		
	}

}
