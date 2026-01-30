precision mediump float;
uniform float time;
 
float pitchb  = 30.0 ;

void main() {    
        gl_FragColor = int(mod(gl_FragCoord.y+time*8., pitchb))==0 || int(mod(gl_FragCoord.x+time*9.0, pitchb)) == 0?vec4(0.3,0.6,gl_FragCoord.x,1.0):vec4(0);
	
	gl_FragColor += int(mod(gl_FragCoord.y+time*10.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*10.0, pitchb)) == 0?vec4(gl_FragCoord.x,0.6,0.8,1.0):vec4(0);
	gl_FragColor += int(mod(gl_FragCoord.y+time*12.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*12.0, pitchb)) == 0?vec4(0.3,gl_FragCoord.x,0.8,1.0):vec4(0);
	gl_FragColor += int(mod(gl_FragCoord.y+time*14.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*14.0, pitchb)) == 0?vec4(0.3,0.6,gl_FragCoord.x,1.0):vec4(0);
	gl_FragColor += int(mod(gl_FragCoord.y+time*16.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*16.0, pitchb)) == 0?vec4(gl_FragCoord.x,0.6,0.8,1.0):vec4(0);
	gl_FragColor += int(mod(gl_FragCoord.y+time*18.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*18.0, pitchb)) == 0?vec4(0.3,gl_FragCoord.x,0.8,1.0):vec4(0);
	gl_FragColor += int(mod(gl_FragCoord.y+time*20.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*20.0, pitchb)) == 0?vec4(0.3,0.6,gl_FragCoord.x,1.0):vec4(0);
	gl_FragColor += int(mod(gl_FragCoord.y+time*22.0, pitchb))==0 || int(mod(gl_FragCoord.x+time*22.0, pitchb)) == 0?vec4(gl_FragCoord.x,0.6,0.8,1.0):vec4(0);
}