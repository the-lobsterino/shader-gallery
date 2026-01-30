/*
 * Original shader from: https://www.shadertoy.com/view/MtdGW7
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time*10.0
#define iResolution resolution
vec4 iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
//Alien detector v 0.2
//alien meter added.
// Based on works:
//https://www.shadertoy.com/view/4s2SRt by ndel
//https://www.shadertoy.com/view/Xsy3zG by Andre
//http://patriciogonzalezvivo.com/2015/thebookofshaders/08/ by patricio gonzalez
//welcome to use
#define outerRadius 0.324
#define outerDottedRadius 0.23
#define innerDottedRadius 0.11
#define innerRadius 0.2 + 0.1*sin(time)
#define cirleWidth 0.01
#define PI 3.1415926535897932384626433832795
#define red   vec3(1.00,0.38,0.227)
#define blue vec3(0.09,0.45,0.76)
//one segment for alien meter
float segment(vec2 uv)
{
    uv = abs(uv.yx);
	return (1.0-smoothstep(0.08,0.10,uv.x))
         * (1.0-smoothstep(0.46,0.49,uv.y+uv.x))
         * (1.3 - length(uv*vec2(2.8,2.0)));
}
//convert one segment to digit
float sevenSegment(vec2 uv,int num)
{
	float seg= 0.0;
    //two left segment of the digit
    float twoLeft = segment(vec2(abs(uv.y),uv.x-0.5))+segment(vec2(abs(uv.y-1.),uv.x-0.5));
    //three horizontal segement
    float threeHorizontal=segment(vec2((uv.x),abs(uv.y-1.5)))+segment(vec2((uv.x),abs(uv.y-0.5)))
        +segment(vec2((uv.x),abs(uv.y+0.5)));
    //one left down and one right up
    float downUpVertical = segment(vec2(abs(uv.y),uv.x+0.5)) 
        + segment(vec2(abs(uv.y-1.),uv.x-0.5));
    //opposite to previous
    float upDownVertical = segment(vec2(abs(uv.y),uv.x-0.5)) 
        + segment(vec2(abs(uv.y-1.),uv.x+0.5));
       
    if (num==1) seg = twoLeft;
    if (num==2) seg = downUpVertical + threeHorizontal;
    if (num==3) seg = twoLeft + threeHorizontal;
    if (num==4) seg = twoLeft+segment(vec2(abs(uv.y-1.),uv.x+0.5))+segment(vec2((uv.x),abs(uv.y-0.5)));
    if (num==5) seg = upDownVertical + threeHorizontal;
    if (num==6) seg = upDownVertical + threeHorizontal+segment(vec2(abs(uv.y),uv.x+0.5));
    if (num==7) seg = twoLeft+segment(vec2((uv.x),abs(uv.y-1.5)));
	if (num==8) seg = upDownVertical+ downUpVertical + threeHorizontal;
    if (num==9) seg = upDownVertical+ twoLeft + threeHorizontal;
    if (num==0) seg = upDownVertical+ downUpVertical+segment(vec2((uv.x),abs(uv.y-1.5)))+segment(vec2((uv.x),abs(uv.y+0.5)));
    
    seg += (upDownVertical+ downUpVertical+threeHorizontal)*0.15;
    
	return seg;
}
//make value out of digit
float printValue(vec2 uv,float num){
	
	float v=0.; 

    for(float i=0. ; i<2. ; i++){
        //convert float to two figures
		float d=num/pow(10.,i)*10.;
        d = mod(floor(d+0.000001),10.0);
		v+=sevenSegment(uv+vec2(i*1.3,0.),int(d));
	}

    return v;
}
//rotate radar
vec2 rotate(vec2 uv, float angle)
{
    float a = angle*PI/180.0; 
    vec2 c = vec2(uv.x*cos(a)-uv.y*sin(a), //rotate
                    uv.x*sin(a)+uv.y*cos(a));
    return c;
}
float line(vec2 center, vec2 uv, float radius, float theta,float start,float finish)
{
	vec2 d = uv - center;

    vec2 p = vec2(cos(theta*PI/180.0),
                        -sin(theta*PI/180.0));
    float l = length( d - p*clamp( dot(d,p)/dot(p,p), radius*start, radius*finish) );
    l = smoothstep(cirleWidth,cirleWidth-0.02,l);
    return l;
}
vec3 bip(vec2 uv, vec2 center, float width)
{
    vec2 diff = center-uv;
    float r = length(diff);
    float scale = mod(iTime,2.);
    float angle = 0.5 * abs(cos(center.x));
    float circle = smoothstep(min(0.0,scale), scale+width, r)
       * smoothstep(scale+width, min(0.0,scale), r);
    circle += smoothstep(scale, scale+width/4., r)
       * smoothstep(scale+width/4.,scale, r)*2.*PI;

    return vec3(circle);
}

float circle (vec2 center, vec2 uv, float r)
{
    float distanceToCenter = distance(center,uv);
	float distancePointToCircle = abs(distanceToCenter - r);
	return smoothstep(r,r+cirleWidth,distancePointToCircle) * 
        smoothstep(r+cirleWidth, r,distancePointToCircle);
}
float outerDottedCircle (vec2 center, vec2 uv, float r)
{
    float distanceToCenter = distance(center,uv);
	float distancePointToCircle = abs(distanceToCenter - r);
	float c = smoothstep(r,r+cirleWidth,distancePointToCircle) * 
        smoothstep(r+cirleWidth, r,distancePointToCircle)
        *(step(0.39,abs(uv.y))*step(0.39,abs(uv.x)));
    
    return c;
   
    
}
float innerDottedCircle (vec2 center, vec2 uv, float r)
{
    float distanceToCenter = distance(center,uv);
	float distancePointToCircle = abs(distanceToCenter - r);
	float c = smoothstep(r,r+cirleWidth,distancePointToCircle) * 
        smoothstep(r+cirleWidth, r,distancePointToCircle)
        *(step(0.39,abs(uv.x))+step(0.39,abs(uv.y)));
    
    return c;
   
    
}
float alien (vec2 coord, vec2 uv)
{
    float distanceToCenter = distance(coord,uv);
    return abs(sin(5.*iTime)) * smoothstep(cirleWidth*2.,cirleWidth,distanceToCenter);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	
    vec3 color = vec3(0.0);
    vec2 alienCoord = vec2(-0.2,-0.25); //coordinates of alien
    vec2 uv = fragCoord.xy / iResolution.xy; //move coordinates to 0..1
    vec2 center = uv/2.; //find center
    //distance meter
    //float digit = length(alienCoord*10.);
    //float digitSize = 40.;
    //float l = printValue(uv*digitSize-vec2(19.8,2.),digit);
    //color.r+=l;
    //bottom frontier
    //float bottom = step(0.9,1.-uv.y);
    //float bottom2 = step(0.975,1.-uv.y);
    //float r=step(.2, length(center.xy)); //left side cut
    //float r2=step(.2, length(center.xy-vec2(0.49,0.0))); //right side cut
    //color+=clamp(bottom-r,0.0,1.0)*blue;
    //color+=clamp(bottom-r2,0.0,1.0)*blue;
    //color+=clamp(bottom2*r2*r,0.0,1.0)*blue;

    //coordinates for radar
    uv = uv*2.; // scale coordinates to 0..+2
    uv.x *= iResolution.x/iResolution.y; //correct x coordinate
    uv.x-=2.; //translate x to center
    uv.y-=1.;
    vec2 mouse = vec2(iMouse.xy);
    uv = rotate(uv,time * 10.);
	center = uv/2.; //find center
    

	//circles
    color += vec3(outerDottedCircle(center,uv,outerDottedRadius))*2.*blue;
    color += vec3(innerDottedCircle(center,uv,innerDottedRadius))*2.*blue;
    color += vec3(circle(center,uv,outerRadius))*2.*blue;
    color += vec3(circle(center,uv,innerRadius))*2.*blue;
    //bip
    color += bip(uv,center,0.1)*blue;
    //aim big lines
    color += line (center,uv,outerRadius,45.,0.8,2.1)*blue;
    color += line (center,uv,outerRadius,90.,0.7,2.1)*blue;
    color += line (center,uv,outerRadius,135.,0.8,2.1)*blue;
    color += line (center,uv,outerRadius,180.,0.7,2.1)*blue;
    color += line (center,uv,outerRadius,225.,0.8,2.1)*blue;
    color += line (center,uv,outerRadius,270.,0.7,2.1)*blue;
    color += line (center,uv,outerRadius,315.,0.8,2.1)*blue;
    color += line (center,uv,outerRadius,0.,0.7,2.1)*blue;
    //small lines
    color += line (center,uv,outerRadius,25.,1.9,2.1);
    color += line (center,uv,outerRadius,65.,1.9,2.1);
    color += line (center,uv,outerRadius,115.,1.9,2.1);
    color += line (center,uv,outerRadius,155.,1.9,2.1);
    color += line (center,uv,outerRadius,205.,1.9,2.1);
    color += line (center,uv,outerRadius,245.,1.9,2.1);
    color += line (center,uv,outerRadius,295.,1.9,2.1);
    color += line (center,uv,outerRadius,335.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,30.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,60.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,120.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,150.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,210.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,240.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,300.,1.9,2.1);
    color += line (center,uv,innerDottedRadius,330.,1.9,2.1);
    //alien
	color += alien(center+alienCoord,uv);

    //final color
	fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0.0, 0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}