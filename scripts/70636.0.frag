#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

////This is the precision. This must be set first
precision mediump float; //set the precision
////grab the uniform from the management code (in JS)
    ////These uniforms need to be set up in your management code
    uniform vec2 resolution; 
    uniform vec2 mouse;
    uniform float time;
    
    ////This i s the main loop
    void main() {
    
    ////Takes width and height, divide it by two, give to the pos vector
    ////Draw in the middle
    vec2 pos = vec2(resolution.x/2.0, resolution.y/2.0);
    
    //vec2 pos = vec2(resolution.x/3.*mouse.x, resolution.y/2.*mouse.y);
    //vec2 pos = resolution.xy/2.0;
	////colour depends on the current fragment positon and the centre of the screen
    ////Geth the distance from the centre to the current fragment, then use it to determine a colour 
    float colour = distance(gl_FragCoord.xy, pos);
    colour *= 0.009; ////This scales the distance field a bit
    
    
    float changingSize = abs(sin(time/1.0))/0.3;
    
    
    ////Colorful background
    //vec4 graidentColor = vec4(abs(sin(time)), 0.0, abs(cos(time)), 1.0)*2.; 
    
    ////White background
    vec4 gradientColor = vec4(abs(sin(time))*0.9, abs(cos(time))*1.4, abs(cos(time)), 1.0)*0.8; 

    vec4 breathingCircle = vec4(vec3(colour), 1.0)*changingSize;
    gl_FragColor = gradientColor*breathingCircle;
    
    //gl_FragColor = breathingCircle;

    
    ////Below is for squared distance
    ////Calculate the difference between the centre of our circle to the current pixel location
    //vec2 pos = gl_FragCoord.xy-resolution/2.;
    
    ////dot product tells the intersection between the two vectors
    ////Calculate the magnitudes
    //float dist_squared = dot(pos, pos)*0.0001;
    
	//gl_FragColor = vec4(vec3(dist_squared), 1.0);
    }