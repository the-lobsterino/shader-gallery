#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// quick port from https://www.shadertoy.com/view/XdffRN

#define iMouse 		(mouse.xyxy * vec4(resolution, 1., 1.))
#define iResolution 	resolution
#define fragCoord 	gl_FragCoord
	
// Author: ocb
// Title: algo RT by sector Demo

// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

// Algo developped for "the Boreal Spring" shader
// https://www.shadertoy.com/view/ldXBRH

// The aim of this program is a demo of getNextCell() function used in the Boreal Spring shader
// It is a 2D view from above of a scenery with lot of objects.
// The red line represents one ray in the raytracing process.
// The objective when you have a lot of objects is to RayTrace only the objects along the ray,
// avoiding heavy calculation when mapping or raytracing hundreds or thousands objects.
// The solution here is to divide the space in sectors or cells, represented by the blue grid.
// We have to find a efficient process to find the cells crossed by the ray to take
// advantage on mapping all objects.

// Ray (red line) is moved by mouse
// Magenta dots represent an object (here it could be a sphere view from above)

// cells in gray are the ones crossed by the ray, wich contain no object
// => very fast calculation to find the next cell.

// cells in blue are the ones with an object.
// => heavy calculation (ray marching or ray tracing)

// blue dots are the ones hit by ray.
// if no transparency, process stop at first hit.

// Cells left in black are ignored!

// Finaly, to make sure process will stop even with no hit, the ray max distance
// must be limited. Here max dist is 20 cells.

// As we can see, with hundreds of object in the scenery, we have only very few blue cells,
// involving raytrace calculation.
// others are simply ignored.


#define INFINI 1000.


//----------------------------
float rand1 (in float v) { 						
    return fract(sin(v) * 437585.);
}
float rand2 (in vec2 st,in float time) { 						
    return fract(sin(dot(st.xy,vec2(12.9898,8.233))) * 43758.5453123+time);
}

//-----------------------------
// find if a cell contain object
vec3 getObj(in vec2 cell, in float cellD){
    vec3 ob= vec3(0.);
    ob.z = rand2(cell*5.87,1.);
    if (ob.z>.7){
        ob.xy = .6*vec2(rand2(cell*1.44,0.)-.5,rand2(cell*2.51,0.)-.5);
        ob.xy += cell;
        ob.z = .2;
        ob *= cellD;
    }
    else ob.z=0.;
    return ob;
}

//-----------------------------
// raytrace object
float objImpact(in vec3 obj,in vec2 p, in vec2 v){
    float t = INFINI;
    vec2 d = obj.xy-p;
    float b = dot(d,v);
    	float c = dot(d,d) - obj.z*obj.z;
    	float disc = b*b - c;
    	if (disc >= 0.){
        	float sqdisc = sqrt(disc);
        	float t1= b + sqdisc;
        	float t2= b - sqdisc;
    		t = min(t1,t2) ;
        	if (t <= 0.001){
            	t = max(t1,t2);
            	if (t <= 0.001) t = INFINI;
        	}
    	}
    return t;
}

//------------------------------//
//THE KEY FONCTION:             //
//------------------------------//
vec2 getNextCell(in vec2 p, in vec2 v, in vec2 cell, in float cellD){
    vec2 d = sign(v);
	vec2 dt = ((cell+d*.5)*cellD-p)/v;
    d *= vec2( step(dt.x-0.01,dt.y) , step(dt.y-0.01,dt.x) );		// -0.01 to avoid cell change for epsilon inside
    return cell+d;
}
//-----------------------------
// is there object?
// is there hit if raytraced?
// render object.
bool checkObject(in vec2 cell,in float cellD,in vec2 mp,in vec2 v, in vec2 st, inout vec3 color){
    bool impact = false;
    color += vec3(.2);
    vec3 obj = getObj(cell, cellD);
    if(obj.z > 0.){
        color.b += .5;
        float t = objImpact(obj,mp,v);
        if(t != INFINI){
            color.g += .8*step(-obj.z,-length(obj.xy-st));
            impact = true;
        }
    }
    return impact;
}



void main(void) 
{
    vec2 st = fragCoord.xy/iResolution.xy-.5;
    st.x *= iResolution.x/iResolution.y;

    vec3 color = vec3(0.);
    vec2 cell;
    float cellD = .05;
    vec2 p;
    
    vec2 mp = iMouse.xy/iResolution.xy-.5;
    mp.x *= iResolution.x/iResolution.y;
    vec2 op = vec2(.2);//.3*vec2(cos(u_time*.3),sin(u_time*.4));
    vec2 v = normalize(op-mp);
    
    //--------------------------------------------------------
    // demo visualisation
    
    //grid
    vec2 c = floor(st/cellD +.5);
    vec2 f = fract(st/cellD +.5)-.5;
    float grid = smoothstep(.9,1.,abs(f.x-.5))+smoothstep(.9,1.,abs(f.y-.5));
    //color += .4*vec3((c+10.)/20.,.0);
    color += vec3(0.,0.,grid);
    vec3 obj = getObj(c,cellD);
    color.rb += .5*step(-obj.z,-length(obj.xy-st));
    
    //ray
    float ray = step(sign(v.x)*mp.x,sign(v.x)*st.x)*smoothstep(st.y-0.002,st.y, v.y/v.x*(st.x-op.x) + op.y)*(1.-smoothstep(st.y,+st.y+.002, v.y/v.x*(st.x-op.x)+ op.y));
    color.r += ray;
    
    //--------------------------------------------------------
    //The actual process
    
    //first cell
    bool impact = false;
    cell = floor(mp/cellD +.5);
    if(c==cell) impact = checkObject(cell,cellD,mp,v,st, color);
    
    //other cell
    if(!impact){
    	for(int i=0; i<20;i++){
        	cell = getNextCell(mp,v,cell,cellD);
        	if(c==cell) impact = checkObject(cell,cellD,mp,v,st,color);
            if(impact) break;
    	}
    }
    
    gl_FragColor = vec4(color, 1.0);
}
