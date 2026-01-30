// @danbri learning mess

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


vec4 white = vec4(1.,1.,1.,1.);
vec4 black = vec4(0.,0.,0.,1.);
vec4 red = vec4(1.,0.,0,1.);
vec4 green = vec4(0.,1.,0.,1.);
vec4 blue = vec4(0.,0.,1.,1.);
vec4 neon = vec4(0.4,1.,0.,1.);

float EXCITES = 1.0;
float INHIBITS = -1.0;

// Don't think about this too much. I didn't.
float MAXIMALLY = 1.0; 
float STRONGLY = 0.9; 
float SOMEWHAT = 0.5;
float RATHER = 0.7;
float MODERATELY = 0.3;
float NOTABLY = 0.2; 
float MODESTLY = 0.1;
float SLIGHTLY = 0.05;
float MINIMALLY = 0.000000001;
float DOESNOT = 0.0;

// Asymmetrical affinity matrix
// Red boosts redness, boosts greenness, inhibits blueness.
float R_R = STRONGLY * EXCITES; 
float R_G = SOMEWHAT * EXCITES;
float R_B = MODERATELY * INHIBITS;

// Green boosts Redness moderately, slightly inhibits greenness, fairly strongly boosts blueness.
float G_R = SOMEWHAT * EXCITES;
float G_G = MODESTLY * INHIBITS;
float G_B = RATHER * INHIBITS;

// Blue somewhat inhibits redness, slightly excites greenness, and somewhat boosts blueness.
float B_R = NOTABLY * INHIBITS;
float B_G = MODESTLY * EXCITES;
float B_B = MODESTLY * EXCITES;


float squash(float x){ return (smoothstep(0.,1.,x));}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pixel = 1./resolution;
	vec2 cursor = (position-mouse) * vec2(1.,(resolution.y/resolution.x));
        float beat = sin(time * 15.0);		 
	
        float rnd1 = mod(fract(sin(dot(position + time * 0.111, vec2(14.9898,78.233))) * 43758.5453), 1.0);
        float rnd2 = mod(fract(sin(dot(position + time * 0.222, vec2(14.9898,78.233))) * 43758.5453), 1.0);
	float rnd3 = mod(fract(sin(dot(position + time * 0.333, vec2(14.9898,78.233))) * 43758.5453), 1.0);
	
	// inject noise into world near mouse pointer
	if (length(cursor) < 0.01 + (rnd1/33.)) {
	        gl_FragColor = vec4(rnd1,rnd2,rnd3,1.0);
	} else {
		// Here we draw everything except the jiggly bit near the mouse:
		
		vec4 me = texture2D(backbuffer, position); // or position as: position + pixel * vec2(-1., -1.)).g to sample neighbours
		gl_FragColor = black;
		vec4 newMe = vec4(0.0,0.0,0.0,1.0);
		
		// see http://glslsandbox.com/e#207.3 for Conway (west = -1; north = 1 etc)
                                                                            // EASTNESS, NORTHNESS  (this is wrong/flipped)
		vec4 NorthWestOfMe  = texture2D(backbuffer, position + pixel * vec2(-1., +1.));
		vec4 NorthOfMe      = texture2D(backbuffer, position + pixel * vec2( 0., +1.));
		vec4 NorthEastOfMe  = texture2D(backbuffer, position + pixel * vec2(+1., +1.));
		vec4 WestOfMe       = texture2D(backbuffer, position + pixel * vec2(-1.,  0.));
		vec4 EastOfMe       = texture2D(backbuffer, position + pixel * vec2(+1.,  0.));
		vec4 SouthWestOfMe  = texture2D(backbuffer, position + pixel * vec2(-1., -1.));
		vec4 SouthOfMe      = texture2D(backbuffer, position + pixel * vec2( 0., -1.));
		vec4 SouthEastOfMe  = texture2D(backbuffer, position + pixel * vec2(-1., -1.));
		
		// set new RGBs
		// These are only based on me (our exact pixel) previous value from backbuffer
		
		vec3 extras =   vec3( (beat * 0.01 * (2.*(rnd1-0.5))), (beat * 0.01 * (2.*(rnd2-0.5)) ),
				    (beat * 0.01 * (2.*(rnd3-0.5)) ) );
		
		newMe.rgb = vec3 ( squash((R_R * me.r) + (G_R * me.g) + (B_R) * me.b    ), 
		                   squash((R_G * me.r) + (G_G * me.g) + (B_G) * me.b    ), 
		                   squash((R_B * me.r) + (G_B * me.g) + (B_B) * me.b    ) );  

		
		newMe.rgb = vec3 ( 
			           squash((R_R * SouthEastOfMe.r) + (G_R * SouthEastOfMe.g) + (B_R) * SouthEastOfMe.b ) ,
		                   squash((R_G * SouthEastOfMe.r) + (G_G * SouthEastOfMe.g) + (B_G) * SouthEastOfMe.b ),
		                   squash((R_B * SouthEastOfMe.r) + (G_B * SouthEastOfMe.g) + (B_B) * SouthEastOfMe.b ) );

                
		
		
		
		gl_FragColor = newMe;
				
		
		
	} 
	


} 