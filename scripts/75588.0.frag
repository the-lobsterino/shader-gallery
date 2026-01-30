const bool donuts = true;                                                   precision highp float;
                                                                    uniform vec2 resolution;uniform float
                                                                time;vec3 j(vec3 a,vec3 b,float f){float g=dot
                                                            (a,b);vec3 c=g*b;float h=length(c-a);vec3 e=normalize
                                                          (c-a),i=normalize(cross(e,b));return c+e*h*cos(f)+i*h*sin
                                                        (f);}float t(vec3 a){vec3 b=vec3(normalize(a.xy),0.);;;return
                                                      length(a-b)-.5;}float d(vec3 a){a=j(a,vec3(0.,1.,0.),time),a=j(a,
                                                    vec3(1.,0.,0.),time);return t(a);}vec3 k(vec3 a){float b=d(a+vec3(.01
                                                  ,0.,0.)),c=d(a-vec3(.01,0.,0.)),e=d(a+vec3(0.,.01,0.)),f=d(a-vec3(0.,.01,
                                                  0.)),g=d(a+vec3(0.,0.,.01)),h=d(a-vec3(0.,0.,.01));return normalize(vec3(
                                                 b-c,e-f,g-h));}float l(vec3 c,               vec3 e){float a=0.,b=1e+4;for(
                                                int f=0;f<256;f++){float g=d                     (c+e*a);b=min(b,g);if(b<.01)
                                                break;a+=g;if(a>10.)break;                        } return b<.01?a:-1.;} void
                                               main(void){vec2 c=(2.0101 *                         gl_FragCoord.xy-resolution
                                               .xy)/resolution.y; vec3 a =                         vec3(0.,0.,4.),i=vec3(0.0),
                                               b=normalize(i-a),m=vec3(0.,                         1.,0.),e=normalize(cross(b,
                                                m)),n=normalize(cross(e,b)                         ),o=a+2.*b+e*c.x+n*c.y, f=
                                                normalize(o-a);float g=l(a,                       f);vec3 h=a+g*f,p =k(h), q=
                                                 vec3(7.,5.,10.),r=normalize(                   q-h);float s=max(dot(r,p),.1
                                                  );vec3 u=g>0.?vec3(s)*vec3(1.3,            .7,.4):vec3(0.0);gl_FragColor=
                                                   vec4(u,1.);} // mmm... donuts ~(8^(|) mmm... donuts ~(8^(|) mmm..donuts
                                                    // ~(8^(|) mmm... donuts ~(8^(|) mmm... donuts ~(8^(|) mmm... donuts.
                                                     // mmm... donuts ~(8^(|) mmm... donuts ~(8^(|) mmmm ~(8^(|) mmm....
                                                       // donuts ~(8^(|) mmm... donuts ~(8^(|) mmm... donuts ~(8^(|) ..
                                                        // ~(8^(|) mmm... donuts ~(8^(|) mmm... donuts ~(8^(|) mmm .
                                                           // mmm... donuts ~(8^(|) mmm... ~(8^(|)  donuts ~(8^(|)
                                                              // donuts ~(8^(|) mmm... donuts ~(8^(|) mmm .....
                                                                  // donuts ~(8^(|) mmm... donuts ~(8^(|) ..
                                                                      // mmm... donuts ~(8^(|) donuts ..
                                                                            // d o n u t s ~(8^(|)


// A Tribute to Homer Simpson ~(8^(|) D'OOH! by:               ║ Marco Gomez ║ @TheCodeTherapy ║ https://xyz.mgz.me ║