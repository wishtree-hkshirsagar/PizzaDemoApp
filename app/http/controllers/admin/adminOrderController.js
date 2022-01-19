const Order = require('../../../models/order').Order;

function adminOrderController() {
    return {
       async getOrders(req, res) {
            let data;
            try{

                await Order.find({ status: {$ne: 'completed'}}, 
                null,
                {sort: { 'createdAt': -1}}).populate('customerId','-password').exec((error, orders)=> {

                       
                    if (Object.prototype.hasOwnProperty.call(req.query, "start")) {
                        const columns = ["srno", "orderId", "customerName", "address", "status", "placedAt"];
                        const columnStart = parseInt(req.query.start);
                       
                        const columnLength = parseInt(req.query.length);
                       
                        const showPage = columnStart / columnLength + 1;
                        const sortColumn = req.query.order[0].column;
                        const sortDirection = req.query.order[0].dir == 'asc'? 1 : -1;
                        const sortCriteria = {};
                        sortCriteria[columns[sortColumn]] = sortDirection;
                        var searchStr = req.query.search;
                       
                        if(searchStr.value !== ""){
                            var regex = new RegExp(searchStr.value, "i");
                            searchStr = { $or: [{'slug':regex },{'status': regex},{'address': regex }] };
                        }else{
                            searchStr={};
                        }
                        var recordsTotal = 0;
                        var recordsFiltered=0;
                       
                        Order.count({}, function(err, c){
                            recordsTotal = c;
                           
                            Order.count(searchStr, function(err, c){
                                recordsFiltered=c;
                                
                                let skip = columnLength * (showPage - 1);
                                let limit = parseInt(columnLength, 10);
                                Order.find(searchStr).skip(skip).limit(limit).sort(sortCriteria).populate('customerId','-password').exec((err, results) => {
                                    console.log('300',results);
                                    if (err) {
                                        console.log('error while getting results'+err);
                                        return;
                                    }
                                    data = JSON.stringify({
                                        "draw": req.query.draw,
                                        "recordsFiltered": recordsFiltered,
                                        "recordsTotal": recordsTotal,
                                        "data": results
                                    });
                                  
                                   return res.send(data);
                                })
                            
                            })
                        })
                    }
                });
            }catch(error){
                return res.status(500).json({
                    msg: 'Error, No Data Found'
                })
            }
        },

        changeOrderStatus(req, res) {
            Order.updateOne({
                _id: req.body.orderId
            }, {
                status: req.body.status
            }, (err, data) => {
                if(err) {
                    res.status(500).json({err: err});
                }
                return res.redirect('/admin/orders');
            })
        }
    }
}

module.exports = adminOrderController;