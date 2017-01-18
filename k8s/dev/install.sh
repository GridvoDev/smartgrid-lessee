#!/bin/bash
kubectl get svc | grep -q smartgrid-lessee
if [ "$?" == "1" ];then
	kubectl create -f smartgrid_lessee-service.yaml --record
	kubectl get svc | grep -q smartgrid-lessee
	if [ "$?" == "0" ];then
		echo "smartgrid_lessee-service install success!"
	else
		echo "smartgrid_lessee-service install fail!"
	fi
else
	echo "smartgrid_lessee-service is exist!"
fi
kubectl get pods | grep -q smartgrid-lessee
if [ "$?" == "1" ];then
	kubectl create -f smartgrid_lessee-deployment.yaml --record
	kubectl get pods | grep -q smartgrid-lessee
	if [ "$?" == "0" ];then
		echo "smartgrid_lessee-deployment install success!"
	else
		echo "smartgrid_lessee-deployment install fail!"
	fi
else
	kubectl delete -f smartgrid_lessee-deployment.yaml
	kubectl get pods | grep -q smartgrid-lessee
	while [ "$?" == "0" ]
	do
	kubectl get pods | grep -q smartgrid-lessee
	done
	kubectl create -f smartgrid_lessee-deployment.yaml --record
	kubectl get pods | grep -q smartgrid-lessee
	if [ "$?" == "0" ];then
		echo "smartgrid_lessee-deployment update success!"
	else
		echo "smartgrid_lessee-deployment update fail!"
	fi
fi