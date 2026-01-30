#ifdef GL_ES
	precision mediump float;
#endif

//This could probably be done a million times better........ AH WELL!
//I apologize for the comments... .... ... .. .. no I don't...
// --LIAM :D (Call me LIME)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
	//Random? In MUH SHADERS?!
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 getSunColor( void ){
	//YELLO!
	return vec4(0.8, 0.8, 0.2, 1.0);
}

bool isStar(float x, float y){
	//Stars shining bright above you, night breezes seem to whisper: "I love you"
	if(rand(vec2(x,y)) > 0.999){
		return true;
	}
	
	return false;
}
vec4 getSkyColor( vec2 sunPos, float normX, float normY, float sunSizePx, float x, float y ){
	if(length(vec2(x - resolution.x * sunPos.x, y - resolution.y * sunPos.y)) < sunSizePx){
		//The Sun is a mass of incandescent gas, a gigantic nuclear furnace
		vec4 r = getSunColor();
		return r;
	}
	float lightness = sunPos.y - 0.3;
	float lightnessRed = clamp(0.0, 1.0, (0.7 - sunPos.y) * 1.5);
	if(sunPos.y < 0.33){
		//I AM THE MAN WHO ARRANGES THE BLOCKS
		lightnessRed = clamp(0.0, 1.0, 1.5 * (0.33 - 4.0*abs(0.33 - (sunPos.y))));
	}
	vec4 r = vec4(0.5*lightness + lightnessRed, 0.5 * lightness, 0.8 * lightness, 1.0);
	if(r.x + r.y + r.z < 0.33){
		//Llama, llama, DARK!
		float d = 0.8 - (max(0.0, r.x + r.y + r.z)/10.0);
		
		if(isStar(x, y)){
			return vec4(d*1.0, d*1.0, d*1.0, 1.0);
		}else{
			return r;
		}
	}else{
		return r;	
	}
}


vec4 getSeaColor( vec2 sunPos, float normX, float normY ){
	//Blue is the uniform color of sea men. HAHAHAAHA I SAID A NAUGHTY WORD HAHAHAHAHAHA FUNNYYYYYYYYYY :DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
	normY = clamp(0.0, 1.0, normY);
	normX = clamp(0.0, 1.0, normX);
	
	float lightness = clamp(0.0, 1.0, sunPos.y - 0.5);
	float lightnessRed = clamp(0.0, 1.0, (0.7 - sunPos.y) * 0.5);
	if(sunPos.y < 0.33){
		lightnessRed = clamp(0.0, 1.0, 0.5 * (0.33 - 4.0*abs(0.33 - (sunPos.y))));
	}
	return vec4(0.0 + max(0.2*lightness + lightnessRed, 0.0), 0.05 + max(0.2 * lightness, 0.0), 0.1 + max(0.5 * lightness, 0.0), 1.0);
}

void main( void ) {
	float normX = gl_FragCoord.x / resolution.x;
	float normY = gl_FragCoord.y / resolution.y;
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	  
	float horizon = 0.4;
	float waveSpeed = 60.0;
	float waveHeight = 0.02;
	float waveLength = 21.0;
	float sunSize = 0.1; //based on resolution height.
	vec2 sunPos = vec2(0.5, 1.4 - mod(time * 0.2, 2.0));
	
	float sunSizePx = sunSize * resolution.y;
	
	if(normY < horizon){
		//water, yay!
		gl_FragColor = getSeaColor( sunPos, normX, normY );
	}else if(normY < (horizon + waveHeight)){
		//DO THE MEXICAN WAVE!!
		if((sin((x+time*waveSpeed) / waveLength) * waveHeight/2.0) > (normY - (horizon + waveHeight/2.0))){
			//BLUE!
			gl_FragColor = getSeaColor( sunPos, normX, normY );
		}else{
			//OTHER BLUE!
			gl_FragColor = getSkyColor( sunPos, normX, normY, sunSizePx, x, y );
		}
	}else{
		//The sky's the limit!
		gl_FragColor = getSkyColor( sunPos, normX, normY, sunSizePx, x, y );
	}
	  
   
  }