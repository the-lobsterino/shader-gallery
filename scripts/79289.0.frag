//a simple 4 layer neural network trained on a 28 by 28 image of a triangle

#extension GL_OES_sttandard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 propogateForward(vec2 uv){
   //input layer with 2 neurons, linear activation
    float n1l1 = uv.x * 3.12208 - 1.5857;
    float n2l1 = uv.y * -2.76058 + 1.48786;
   
    //1st hidden layer with 8 neurons, ReLU activation
    float n1l2 = n1l1 * 0.136199 + n2l1 * 1.34946 + 1.30498;
    n1l2 = max(0.0, n1l2);
   
    float n2l2 = n1l1 * -0.00199323 + n2l1 * 0.802998 + 0.721039;
    n2l2 = max(0.0, n2l2);
   
    float n3l2 = n1l1 * -0.119881 + n2l1 * 0.698856 + 0.598374; 
    n3l2 = max(0.0, n3l2);
   
    float n4l2 = n1l1 * 0.0644318 + n2l1 * 0.714568 + 0.557587;
    n4l2 = max(0.0, n4l2);
   
    float n5l2 = n1l1 * -0.141386 + n2l1 * 0.983542 + 1.02368;
    n3l2 = max(0.0, n5l2);
   
    float n6l2 = n1l1 * -1.63856 + n2l1 * 0.98378 + -1.11278;
    n6l2 = max(0.0, n6l2);
   
    float n7l2 = n1l1 * 0.0327053 + n2l1 * 1.14091 + 1.22367;
    n7l2 = max(0.0, n7l2);
   
    float n8l2 = n1l1 * 2.20044 + n2l1 * 1.49318 + -1.50316;
    n8l2 = max(0.0, n8l2);
    
    //2nd hidden layer with 8 neurons, ReLU activation
    float n1l3 = n1l2 * -0.732157 + n2l2 * -0.891932 + n3l2 * 0.818177 + n4l2 * -0.166244 + n5l2 * 0.504675 + n6l2 * -1.91107 + n7l2 * 0.669006 + n8l2 * -1.33386 + 0.313964; 
    n1l3 = max(0.0, n1l3);
    
    float n2l3 = n1l2 * 1.10302 + n2l2 * 0.0999441 + n3l2 * -0.0343741 + n4l2 * -0.833773 + n5l2 * -1.21369 + n6l2 * -0.566044 + n7l2 * 0.452029 + n8l2 * -0.316553 + -0.671326;
    n2l3 = max(0.0, n2l3);
    
    float n3l3 = n1l2 * -0.68761 + n2l2 * 0.847783 + n3l2 * -0.0601765 + n4l2 * 0.124069 + n5l2 * -1.12233 + n6l2 * -0.370512 +  n7l2 * -0.550546 +  n8l2 * -0.344858 + 0.388379;
    n3l3 = max(0.0, n3l3);
    
    float n4l3 = n1l2 * -0.167778 + n2l2 * -0.219596 + n3l2 * -0.412508 + n4l2 * 1.15054 + n5l2 * -0.389043 + n6l2 * 0.0321998 + n7l2 * 0.351151 + n8l2 * -0.321243 + -0.217014;
    n4l3 = max(0.0, n4l3);
    
    float n5l3 = n1l2 * 1.4767 + n2l2 * -0.769722 + n3l2 * 0.0979612 + n4l2 * -0.615703 + n5l2 * 0.271538 + n6l2 * -0.355892 + n7l2 * -1.13254 + n8l2 * -0.873667 + -0.364012;
    n5l3 = max(0.0, n5l3);
    
    float n6l3 = n1l2 * 0.938561 + n2l2 * 0.0767593 + n3l2 * -0.663377 + n4l2 * 0.699145 + n5l2 * -0.647789 + n6l2 * 0.405287 + n7l2 * -0.684911 + n8l2 * -1.21433 + -0.394118;
    n6l3 = max(0.0, n6l3);
    
    float n7l3 = n1l2 * -1.2359 + n2l2 * 0.263993 + n3l2 * 0.306471 + n4l2 * -0.473546 + n5l2 * 0.321738 + n6l2 * -1.39976 + n7l2 * 0.814785 + n8l2 * -0.901326 + 0.281957;
    n7l3 = max(0.0, n7l3);
    
    float n8l3 = n1l2 * 0.306962 + n2l2 * -0.205671 + n3l2 * -0.612426 + n4l2 * -0.404743 + n5l2 * -1.01003 + n6l2 * -0.258058 + n7l2 * 1.05767 + n8l2 * -1.66925 + 0.134617; 
    n8l3 = max(0.0, n8l3);
    
    //output layer with 3 neurons, linear activation
    float n1l4 = n1l3 * 1.32311 + n2l3 * -0.514979 + n3l3 * -0.114528 + n4l3 * -0.573265 + n5l3 * 0.403032 + n6l3 * -0.864705 + n7l3 * -1.39364 + n8l3 * 0.0461393 + -0.00597041;
    float n2l4 = n1l3 * 0.28029 + n2l3 * -1.01897 + n3l3 * -0.788003 + n4l3 * 0.524296 + n5l3 * -1.16218 + n6l3 * -1.07429 + n7l3 * -0.199235 + n8l3 * 1.59994 + -0.022515;  
    float n3l4 = n1l3 * 0.274414 + n2l3 * -0.566775 + n3l3 * -0.975647 + n4l3 * -0.787626 + n5l3 * 0.517561 + n6l3 * 0.206326 + n7l3 * 0.841286 + n8l3 * -0.0625629 + 0.0094759;  
    
    return vec3(n1l4,n2l4,n3l4);
}

void main(void){
    //normalize and center
    vec2 uv = gl_FragCoord.xy/resolution.xy*2.0-1.0;
    uv.x*=resolution.x/resolution.y;
    uv += vec2(0.5,-0.5);
    uv.y *= -1.0;
    
    //propogate pixel coordinate, comment if statement to see out of bounds (nothing interesting there really)
    if(uv.x < 0.99 && uv.y < 0.94 && uv.x > 0.03){
        gl_FragColor = vec4(propogateForward(uv),1.0);
    }else{
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
    }
}