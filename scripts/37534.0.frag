precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define RED vec3(1.0,0.0,0.0)

#define BLUE vec3(0.0,0.0,1.0)

#define TEAL  vec3(0.2,0.4,0.45)

#define BROWN vec3(0.3,0.23,0.2)

#define TRAIL vec3(0.33, 0.36, 0.23)  

#define CURRENTCOLOR RED

#define X_SHIFT 0.01
#define Y_SHIFT 0.005

vec3 color = vec3(1.0);

//Function to check circle interior
float circle(vec2 pos, float X, float Y, float rad, vec3 col)
{
	float r =  length(vec2(pos) - vec2(X,Y));
	if( r > rad)
	return 0.0;
	else
	return r;
}

float radius = 0.0;
float radius1 = 0.0;
void main( void ) {

vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
float ar = resolution.x / resolution.y;
position.x *= ar;
vec2 center = vec2(0.5,0.5);
vec2 fromCenter = position - center;

//Circle Background: First we render the color circle
//CURRENTCOLOR will be used
radius = circle(fromCenter, X_SHIFT, Y_SHIFT, 0.2, vec3(1.0, 0.0,0.0));
if(radius != 0.0)
{

     //Smooth circle from the center 	
     float limit = smoothstep(0.18, 0.2,radius); 
     color = mix(CURRENTCOLOR, vec3(1.0), limit );
}

//Black circle  on the foreground
radius1 =  circle(fromCenter, 0.0, 0.0, 0.2, vec3(1.0, 0.0,0.0));
if(radius1 != 0.0)
{
    //Smooth circle from the center with the already existing color  ( white or CURRENTCOLOR)
    float limit = smoothstep(0.19, 0.2,radius1); 

    vec3 color1 =  mix(vec3(0.0,0.0,0.0), color, limit );
    color = color1;
}


gl_FragColor = vec4( color.r, color.g, color.b, 1.0);

}