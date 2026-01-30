col = mix(col, vec3(1,0,0), smoothstep(.01, .025, uv.y+w*.02));
col = mix(col, vec3(0,0,0), smoothstep(.65, .75, uv.y+w*.04));
col += w * .3;
 
gl_FragColor = vec4(col, 4
		    
		    4
		    .0);
}