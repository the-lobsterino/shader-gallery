#ifdef GL_ES
precision mediump float;
#endif
 
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main2();

//#define time abs(sin(time*1e-7*abs(sin((mouse.x*2.0-1.0)+time*.021)))*time+121.0*sin(time*0.02))*0.1
#define time ((time*0.1)+5.0)

#define iterations 8
#define formuparam2 0.679
 
#define volsteps 8
#define stepsize 0.190
 
#define zoom 0.900
#define tile   0.850
#define speed2  0.10
 
#define brightness 0.005
#define darkmatter 0.14000
#define distfading 0.60
#define saturation 0.800


#define transverseSpeed ((zoom/(12.0*(cos(time*1.0)*2.0+1.0)))+0.1)
#define cloud (0.11+0.05*sin(time))

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec2 rotate2d( vec2 v, float _angle ) {
    return v * rotate2d(_angle);
}

/*
float triangle(float x, float a)
{
    float output2 = 2.0*abs(  2.0*  ( (x/a) - floor( (x/a) + 0.5) ) ) - 1.0;
    return output2;
}
*/

float field(in vec3 p) {
   
    float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
    float accum = 0.;
    float prev = 0.;
    float tw = 0.;
   

    for (int i = 0; i < 6; ++i) {
        float mag = 1.-dot(p, p);
        p = abs(p) / mag + vec3(-.5, -.8 + 0.1*sin(time*0.7 + 2.0), -1.1+0.3*cos(time*0.3));
        float w = exp(-float(i) / 7.);
        accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
        tw += w;
        prev = mag;
        //if ( fract(time*100.0*sin(time*0.1)) > 0.499 ) break;
    }
    return max(0., 5. * accum / tw - .7);
}



void main()
{
  
         vec2 uv2 = surfacePosition*1.0;//2. * gl_FragCoord.xy / resolution.xy - 1.;
    vec2 uvs = uv2;// * resolution.xy / max(resolution.x, resolution.y);
    uvs *= 10.0/2.1*sin(time*1.5);

   
    float time2 = time;
              
        float speed = speed2;
        speed = 0.005 * cos(time2*0.02 + 3.1415926/4.0) + 3.0;
         
    //speed = 0.0;

   
        float formuparam = formuparam2;

   
   
    //get coords and direction

    vec2 uv = uvs;
   
    for ( float j = 0.0; j < 1.0; j += 0.50 ) {
        uv /= (j-dot(uv,uv))*sin(time*0.1+0.5*sin((time+j)*0.05));
        uv *= 1.0-length(uv)*0.3*sin(j+1.0);
        if ( sin(time*0.001)*(j+1.0) < 0.5 ) break;
    }
   
    uv *= 1.0 - dot( gl_FragCoord.xy / resolution.xy - mouse, gl_FragCoord.xy / resolution.xy - mouse )*0.3;
    float duv = dot(uv,uv);
    if ( duv < 0.35 ) {
        float a = 1.0/(2.8*duv*cos(time*0.1));
        rotate2d(uv,a+time*1e4);
        uv = mix( uv, uv *= 1.0 - length(uv), a );
    }
    
    
    float len = length(uv);
    vec2 uvn = normalize(uv);
    
    if ( 0.1 > len ) uv = uvn*uv*len*0.1;//vec2(0.0);//uvn * 0.0;
    
       
    //mouse rotation
    float a_xz = 0.9;
    float a_yz = -.6;
    float a_xy = 0.9 + time*0.1;
   
   
    mat2 rot_xz = mat2(cos(a_xz),sin(a_xz),-sin(a_xz),cos(a_xz));
   
    mat2 rot_yz = mat2(cos(a_yz),sin(a_yz),-sin(a_yz),cos(a_yz));
       
    mat2 rot_xy = mat2(cos(a_xy),sin(a_xy),-sin(a_xy),cos(a_xy));
   

    float v2 =1.0;
   
    vec3 dir=vec3(uv*zoom,1.);
 
    vec3 from=vec3(0.0, 0.0,0.0);
 
                              
        from.x -= 5.0*(mouse.x-0.5);
        from.y -= 5.0*(mouse.y-0.5);
              
              
    vec3 forward = vec3(0.,0.,1.);
              
   
    from.x += transverseSpeed*(1.0)*cos(0.01*time) + 0.001*time;
        from.y += transverseSpeed*(1.0)*sin(0.01*time) +0.001*time;
   
    from.z += 0.003*time;
   
   
    dir.xy*=rot_xy;
    forward.xy *= rot_xy;

    dir.xz*=rot_xz;
    forward.xz *= rot_xz;
       
   
    dir.yz*= rot_yz;
    forward.yz *= rot_yz;
     

   
    from.xy*=-rot_xy;
    from.xz*=rot_xz;
    from.yz*= rot_yz;
     
   
    //zoom
    float zooom = (time2-3311.)*speed;
    from += forward* zooom;
    float sampleShift = mod( zooom, stepsize );
     
    float zoffset = -sampleShift;
    sampleShift /= stepsize; // make from 0 to 1


   
    //volumetric rendering
    float s=0.24;
    float s3 = s + stepsize/2.0;
    vec3 v=vec3(0.);
    float t3 = 0.0;
   
   
    vec3 backCol2 = vec3(0.);
    for (int r=0; r<volsteps; r++) {
        vec3 p2=from+(s+zoffset)*dir;// + vec3(0.,0.,zoffset);
        vec3 p3=from+(s3+zoffset)*dir;// + vec3(0.,0.,zoffset);
       
        p2 = abs(vec3(tile)-mod(p2,vec3(tile*2.))); // tiling fold
        p3 = abs(vec3(tile)-mod(p3,vec3(tile*2.))); // tiling fold
       
        #ifdef cloud
        t3 = field(p3);
        #endif
       
        float pa,a=pa=0.;
        for (int i=0; i<iterations; i++) {
            p2=abs(p2)/dot(p2,p2)-formuparam; // the magic formula
            //p=abs(p)/max(dot(p,p),0.005)-formuparam; // another interesting way to reduce noise
            float D = abs(length(p2)-pa); // absolute sum of average change
            a += i > 7 ? min( 12., D) : D;
            pa=length(p2);
        }
       
       
        //float dm=max(0.,darkmatter-a*a*.001); //dark matter 
        a*=a*a; // add contrast
        //if (r>3) fade*=1.-dm; // dark matter, don't render near
        // brightens stuff up a bit
        float s1 = s+zoffset;
        // need closed form expression for this, now that we shift samples
        float fade = pow(distfading,max(0.,float(r)-sampleShift));
       
       
        //t3 += fade;
       
        v+=fade;
                   //backCol2 -= fade;

        // fade out samples as they approach the camera
        if( r == 0 )
            fade *= (1. - (sampleShift));
        // fade in samples as they approach from the distance
        if( r == volsteps-1 )
            fade *= sampleShift;
        v+=vec3(s1,s1*s1,s1*s1*s1*s1)*a*brightness*fade; // coloring based on distance
       
        backCol2 += mix(.4, 1., v2) * vec3(1.8 * t3 * t3 * t3, 1.4 * t3 * t3, t3) * fade;

       
        s+=stepsize;
        s3 += stepsize;
       
       
       
        }
              
    v=mix(vec3(length(v)),v,saturation); //color adjust
     
   
   

    vec4 forCol2 = vec4(v*.01,1.);
   
    #ifdef cloud
    backCol2 *= cloud;
    #endif
   
    backCol2.b *= 1.8;

    backCol2.r *= 0.05;
   
    backCol2.b = 0.5*mix(backCol2.g, backCol2.b, 0.8);
    backCol2.g = 0.0;

    backCol2.bg = mix(backCol2.gb, backCol2.bg, 0.5*(cos(time*0.01) + 1.0));
   
    gl_FragColor = clamp(forCol2 + vec4(backCol2, 1.0), 0.0, 0.5 ) * 2.0;
	
	if ( 0.25 > length(surfacePosition) ) {
		
    		main2();
		
	}

}

// bpt.2016

// -=-=

float time2 = time*3.4;
float width  = resolution.x;
 float height = resolution.y;
const float delta  = 0.0006;
const float PI =  3.14159265;

float sphere(vec3 position, float r)
{
        return length(position) - r;
	//+ 0.53*sin(position.y*1.1 + mod(time2*0.2, 2.0*PI)-PI)
        //+ 0.17*sin(position.z*2.2 + mod(time2*0.02, 2.0*PI)-PI);
}


vec3 rotateX(vec3 pos, float alpha) {
    mat4 trans= mat4(1.0, 0.0, 0.0, 0.0,
                0.0, cos(alpha), -sin(alpha), 0.0,
                0.0, sin(alpha), cos(alpha), 0.0,
                0.0, 0.0, 0.0, 1.0);
                
                
    return vec3(trans * vec4(pos, 1.0));
}

vec3 rotateY(vec3 pos, float alpha) {

                
    mat4 trans2= mat4(cos(alpha), 0.0, sin(alpha), 0.0,
                0.0, 1.0, 0.0, 0.0,
                -sin(alpha), 0.0, cos(alpha), 0.0,
                0.0, 0.0, 0.0, 1.0);
                
    return vec3(trans2 * vec4(pos, 1.0));
}

vec3 translate(vec3 position, vec3 translation) {
    return position - translation;
}


float cube(vec3 pos,float size){
    return max(max(abs(pos.x)-size,abs(pos.y)-size),abs(pos.z)-size) ;//+ 0.17*sin(pos.z*2.2 + mod(time2*0.02, 2.0*PI)-PI);
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}
/*
float function(vec3 position) {
    

    return  sdTorus(
            
            rotateX(
            rotateY(
            
            translate(position.xyz,vec3(0.0,0.0,20.0))
            ,
            time2* 2.3),position.x*0.8 + time2* 0.1)
            
            , vec2(4.0,2.0));
}*/

    


float opS( float d1, float d2 )
{
    return max(-d1,d2);
}

float opRep( vec3 p, vec3 c )
{
    vec3 q = mod(p,c)-0.5*c;
    return sdSphere( q ,0.5);
}

    

float wonderCube(vec3 position) {

vec3 disp = vec3(0.0,0.0,8.9);

vec3 newPos = rotateY(rotateX(translate(position.xyz,disp),2.3*-time2+time),3.8*time2+sin(time*10.01));
	
	
return opS( opRep(newPos, vec3(1.2,1.2,1.2)),udRoundBox(newPos, vec3(2.2,2.2,2.2), 0.5))
;
}

float opCheapBend( vec3 p )
{
    float c = cos(1.9*(1.0+sin(time2*0.3))+p.y*0.19);
    float s = sin(1.9*(1.0+sin(time2*0.3))+p.y*0.18);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return wonderCube(q);
}

float opU( float d1, float d2 )
{
    return min(d1,d2);
}

float opTwist( vec3 p )
{
    float c = cos(sin(p.x)*10.90*p.y);
    float s = sin(0.90*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return wonderCube(q);
}

float opDisplace( vec3 p )
{
    float d1 = sdTorus(p, vec2(4.0,2.0));
    float d2 = (sin(p.x*3.0) + sin(p.y*5.0)) *0.2;
    return d1+d2;
}


float opBlend( vec3 position )
{
vec3 disp = vec3(0.0+4.0*sin(time2*2.2+3.0),0.0+2.0*sin(time2*1.3),8.0+0.3*sin(time2*1.5));

vec3 newPos = rotateY(rotateX(translate(position.xyz,disp),2.3*time2),1.8*time2);
    float d1 = wonderCube(position);
    vec3 p = position;
    float d2 = sin(0.800*p.x)*sin(0.800*p.y)*sin(0.800*p.z) ;
 
    return d1+d2;
}

float function(vec3 position) {
    

    return opCheapBend(position);

//return opBlend(position);

}


const vec3 lightDirection = vec3(-0.5,0.5,-1.0);


vec3 ray(vec3 start, vec3 direction, float t) {
    return start + t * direction;
}

vec3 gradient(vec3 position) {

    return vec3(function(position + vec3(delta, 0.0, 0.0)) - function(position - vec3(delta, 0.0, 0.0)),
    function(position + vec3(0.0,delta, 0.0)) - function(position - vec3(0.0, delta, 0.0)),
    function(position + vec3(0.0, 0.0, delta)) - function(position - vec3(0.0, 0.0, delta)));

    
}

vec4 plasma() {
 vec2 p = -1.0 +2.0 * gl_FragCoord.xy / vec2(640, 360);
float cossin1 = ((cos(p.x * 2.50 +time2*2.5) +sin(p.y*3.70-time2*4.5) +sin(time2*2.5))+3.0)/6.0;
float cossin2 = (cos(p.y * 2.30 +time2*3.5) +sin(p.x*2.90-time2*1.5) +cos(time2)+3.0)/6.0;
float cossin3 = (cos(p.x * 3.10 +time2*5.5) +0.5*sin(p.y*2.30-time2) +cos(time2*3.5)+3.0)/6.0;
return vec4(cossin1, cossin2, cossin3, 1.0);

}


void main2()
{    
    vec3 cameraPosition = vec3(0.0, 0.0, -.4);
    
    float aspect = 360.0/640.0;
    vec3 nearPlanePosition = vec3((gl_FragCoord.x - 0.5 * width) / width * 2.0 ,
                                  (gl_FragCoord.y - 0.5 * height) / height * 2.0 * aspect,
                                   0.0);
                              
    vec3 viewDirection = normalize(nearPlanePosition - cameraPosition);
    
    float t = 0.0;
    float dist;
    vec3 position;
    vec4 color = gl_FragColor; // plasma();//vec4(0.0,0.2,0.0,1);
    vec3 normal;
    vec3 up = normalize(vec3(-0.0, 1.0,0.0));
    
    for(int i=0; i < 32; i++) {
        position = ray(cameraPosition,    viewDirection, t);
        dist = function(position);
        
    
        
        if(abs(dist) < 0.05) {
            
                
            normal = normalize(gradient(position));
            
            vec4 color1 = vec4(0.5, 0.9, 0.5,1.0);
            vec4 color2 = vec4(1.0, 0.1, 0.1,1.0);
            
            vec4 color3 = mix(color2, color1, (1.0+dot(up, normal))/2.0);
            
            
            color = color3 * max(dot(normal, normalize(lightDirection)),0.0) +vec4(0.1,0.1,0.1,1.0);

            //specular
            vec3 E = normalize(cameraPosition - position);
            vec3 R = reflect(-normalize(lightDirection), normal);
            float specular = pow( max(dot(R, E), 0.0), 
                         8.0);
            color +=vec4(0.6, 0.4,0.4,0.0)*specular;
            break;
        }
        
            t = t + dist;
	    dist *= 1.1;
    }
                                  
                                  
    gl_FragColor = color;                                  
    //discard;
}

