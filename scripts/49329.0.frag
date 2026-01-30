#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float kreis(vec2 uv, vec2 p, float r, float blur){ // Function creates a circle of radius r, with blur 
    float d = length(uv-p); // Distance formula 
    float c = smoothstep(r, r-blur, d); // Blurs the edges 
    return c; // Returns the circle
}

float Band(float t, float start, float end, float blur){
    float step1 = smoothstep(start-blur, start+blur, t); // Cuts of the smoothstep to start/end and uses the blur value to add the interval of start/end by a bit to achieve blur
    float step2 = smoothstep(end+blur, end-blur, t); // Horizontal Band, above is Vertical Band
	return step1*step2; // Gets the area in which both step1 and step2 = 1. (if one is .0, it's all .0
}

float Rechteck(vec2 uv, float left, float right, float bottom, float top, float blur){
    float band1 = Band(uv.x, left, right, blur); // Vertical band (x coord)
    float band2 = Band(uv.y, bottom, top, blur); // Horizontal band (y coord)
    return band1*band2; 
}

// Function creates a smiley face (so you don't have to do all the things in main
float Smiley(vec2 uv, vec2 p, float size) 
{
    uv /= size;  // Change size of Smiley by scaling the coordinate system
    
    float gesicht =kreis(uv, vec2(0.), .4, .05); // Uses the circle function to create the outline for the Smiley
    
    gesicht -= kreis(uv, vec2(-.13, .2), .07, 0.01); // Cuts out part of circle to make eyes
    gesicht -= kreis(uv, vec2(.13, .2), .07, 0.01); 
    
    float mund = kreis(uv, vec2(0., 0.), 0.25, 0.002); // Makes an ellipse like shape using Circle for the mouth
    mund -= kreis(uv, vec2(0., 0.1), 0.3, 0.02);
    
    gesicht -= mund; // Subtract the area of the mouth so that it seems like there is a mouth 
    return gesicht;  // Returns the smiley 
}
    

void main( void )
{
    vec2 uv = (gl_FragCoord.xy / resolution.y) - vec2(1.0, 0.5); // set the resolution
    
    float gesicht = Smiley(uv, vec2(0), 1.+0.5*sin(time*2.));
    vec3 farbe = gesicht * vec3(500,50,0); // Set smiley color
    
    float x = -.24+sin(time);
    //mask = Rechteck(uv, x, x+.82, -.4, .4, .02); // blaues Rechteck
      	
    farbe += gesicht * vec3(0,0,1);  // add rectangle color 
    
    gl_FragColor = vec4(farbe, 1.0);
}
